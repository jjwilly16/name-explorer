import { readdir } from 'fs/promises';
import { createReadStream } from 'fs';
import { resolve } from 'path';
import { createInterface } from 'readline';
import Sequelize, { authenticate, sync, Name, NameByYear } from '../src/server/models';

async function loadNames() {
    const fileDir = resolve(__dirname, 'data');
    const files = await readdir(fileDir);

    for await (const file of files) {
        const year = file.replace('yob', '').replace('.txt', '');
        const fs = createReadStream(resolve(fileDir, file));
        const rl = createInterface({
            input: fs,
            crlfDelay: Infinity,
        });
        for await (const line of rl) {
            const lineParts = line.split(',');
            const data = {
                name: lineParts[0],
                gender: lineParts[1],
                occurrences: lineParts[2],
                year,
            };
            // console.log(year, data.name);
            const [name] = await Name.findOrCreate({
                where: { name: data.name },
            });
            const { nameid } = name.dataValues;
            const [nameByYear] = await NameByYear.findOrBuild({
                where: { nameid, year },
            });
            // Add the occurrences
            nameByYear.occurrences = (+nameByYear.occurrences || 0) + +data.occurrences;
            // Add the gender-specific occurrences
            nameByYear[data.gender === 'M' ? 'maleOccurrences' : 'femaleOccurrences'] = data.occurrences;
            // Add the year
            nameByYear.year = data.year;
            await nameByYear.save();
        }
    }

    // Figure out totals for all names (all time)
    const [totalNames] = await NameByYear.findAll({
        attributes: [
            [Sequelize.fn('sum', Sequelize.col('occurrences')), 'allTimeOccurrences'],
            [Sequelize.fn('sum', Sequelize.col('maleOccurrences')), 'allTimeMaleOccurrences'],
            [Sequelize.fn('sum', Sequelize.col('femaleOccurrences')), 'allTimeFemaleOccurrences'],
        ],
    });
    const {
        allTimeOccurrences,
        allTimeMaleOccurrences,
        allTimeFemaleOccurrences,
    } = totalNames.dataValues;

    // Update Names with percentages
    const namesWithAllTimeCount = await Name.findAll({
        attributes: [
            'nameid',
            [Sequelize.fn('sum', Sequelize.col('occurrences')), 'totalOccurrences'],
            [Sequelize.fn('sum', Sequelize.col('maleOccurrences')), 'totalMaleOccurrences'],
            [Sequelize.fn('sum', Sequelize.col('femaleOccurrences')), 'totalFemaleOccurrences'],
        ],
        group: 'nameid',
        include: NameByYear,
    });
    for await (const name of namesWithAllTimeCount) {
        const {
            totalOccurrences,
            totalMaleOccurrences,
            totalFemaleOccurrences,
        } = name.dataValues;
        name.allTimeOccurrences = totalOccurrences;
        name.allTimeMaleOccurrences = totalMaleOccurrences;
        name.allTimeFemaleOccurrences = totalFemaleOccurrences;
        name.allTimePctWithName = totalOccurrences / allTimeOccurrences;
        name.allTimeMalePctWithName = allTimeMaleOccurrences === 0
            ? 0
            : totalMaleOccurrences / allTimeMaleOccurrences;
        name.allTimeFemalePctWithName = allTimeFemaleOccurrences === 0
            ? 0
            : totalFemaleOccurrences / allTimeFemaleOccurrences;
        if (totalFemaleOccurrences === totalMaleOccurrences) {
            name.unisexScore = 1;
        } else {
            name.unisexScore = totalFemaleOccurrences > totalMaleOccurrences
                ? totalMaleOccurrences / totalFemaleOccurrences
                : totalFemaleOccurrences / totalMaleOccurrences;
        }
        await name.save();
    }

    // Update NamesByYear with percentages
    const yearTotals = await NameByYear.findAll({
        attributes: [
            'year',
            [Sequelize.fn('sum', Sequelize.col('occurrences')), 'totalOccurrences'],
            [Sequelize.fn('sum', Sequelize.col('maleOccurrences')), 'totalMaleOccurrences'],
            [Sequelize.fn('sum', Sequelize.col('femaleOccurrences')), 'totalFemaleOccurrences'],
        ],
        group: 'year',
    });
    for await (const yearInQuestion of yearTotals) {
        const {
            year,
            totalOccurrences,
            totalMaleOccurrences,
            totalFemaleOccurrences,
        } = yearInQuestion.dataValues;
        // Loop through each member of this year
        const namesByYearInQuestion = await NameByYear.findAll({
            where: {
                year,
            },
        });
        for await (const entry of namesByYearInQuestion) {
            entry.pctWithName = +entry.occurrences / +totalOccurrences;
            entry.malePctWithName = +entry.maleOccurrences / +totalMaleOccurrences;
            entry.femalePctWithName = +entry.femaleOccurrences / +totalFemaleOccurrences;
            if (+entry.maleOccurrences === +entry.femaleOccurrences) {
                entry.unisexScore = 1;
            } else {
                entry.unisexScore = +entry.femaleOccurrences > +entry.maleOccurrences
                    ? +entry.maleOccurrences / +entry.femaleOccurrences
                    : +entry.femaleOccurrences / +entry.maleOccurrences;
            }
            await entry.save();
        }
    }
}

// // Uncomment this to run
// async function init() {
//     await authenticate();
//     await sync();
//     await loadNames();
// }

init()
    .then(() => {
        console.log('DONE');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

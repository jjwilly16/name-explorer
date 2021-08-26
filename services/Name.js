export default class NameService {
    constructor(sequelize, Sequelize, Name, NameByYear) {
        this.sequelize = sequelize;
        this.Sequelize = Sequelize;
        this.Name = Name;
        this.NameByYear = NameByYear;
    }

    async getStats() {
        const [nameStats] = await this.Name.findAll({
            attributes: [
                [this.Sequelize.fn('min', this.Sequelize.fn('char_length', this.Sequelize.col('name'))), 'minLength'],
                [this.Sequelize.fn('max', this.Sequelize.fn('char_length', this.Sequelize.col('name'))), 'maxLength'],
            ],
            raw: true,
        });
        const [nameByYearStats] = await this.NameByYear.findAll({
            attributes: [
                [this.Sequelize.fn('min', this.Sequelize.col('year')), 'minYear'],
                [this.Sequelize.fn('max', this.Sequelize.col('year')), 'maxYear'],
            ],
            raw: true,
        });
        return {
            ...nameStats,
            ...nameByYearStats,
        };
    }

    async getTotalsByYear({
        gender = null,
        pageSize = 10,
        pageIndex = 0,
        sortOrder = 'DESC',
        orderBy = 'occurrences',
        minLength = null,
        maxLength = null,
        startsWith = null,
        endsWith = null,
        contains = null,
        minYear = null,
        maxYear = null,
        minOccurrences = null,
        maxOccurrences = null
    }) {
        const attributes = [this.Sequelize.col('Name.name')];
        let occurrenceField = 'occurrences';
        if (gender === 'M') occurrenceField = 'maleOccurrences';
        if (gender === 'F') occurrenceField = 'femaleOccurrences';
        attributes.push([this.Sequelize.fn('sum', this.Sequelize.col(occurrenceField)), 'occurrences']);

        const where = {
            [this.Sequelize.Op.and]: [
                {
                    [occurrenceField]: {
                        [this.Sequelize.Op.gt]: 0,
                    },
                },
            ],
        };

        // If gender is neutral, need to retrieve unisex names
        if (gender === 'U') {
            where[this.Sequelize.Op.and].push({
                unisexScore: {
                    [this.Sequelize.Op.gte]: 0.5,
                },
            });
        }

        if (minYear && maxYear && minYear === maxYear) {
            where[this.Sequelize.Op.and].push({
                year: minYear,
            });
        } else if (minYear && maxYear) {
            where[this.Sequelize.Op.and].push({
                year: {
                    [this.Sequelize.Op.between]: [minYear, maxYear],
                }
            });
        } else if (minYear) {
            where[this.Sequelize.Op.and].push({
                year: {
                    [this.Sequelize.Op.gte]: minYear,
                },
            });
        } else if (maxYear) {
            where[this.Sequelize.Op.and].push({
                year: {
                    [this.Sequelize.Op.lte]: maxYear,
                },
            });
        }

        if (minLength && maxLength && minLength === maxLength) {
            where[this.Sequelize.Op.and].push(
                this.Sequelize.where(
                    this.Sequelize.fn('char_length', this.Sequelize.col('Name.name')), minLength
                )
            );
        } else if (minLength && maxLength) {
            where[this.Sequelize.Op.and].push(
                this.Sequelize.where(
                    this.Sequelize.fn('char_length', this.Sequelize.col('Name.name')), {
                        [this.Sequelize.Op.between]: [minLength, maxLength],
                    }
                )
            );
        } else if (minLength) {
            where[this.Sequelize.Op.and].push(
                this.Sequelize.where(
                    this.Sequelize.fn('char_length', this.Sequelize.col('Name.name')), {
                        [this.Sequelize.Op.gte]: minLength,
                    }
                )
            );
        } else if (maxLength) {
            where[this.Sequelize.Op.and].push(
                this.Sequelize.where(
                    this.Sequelize.fn('char_length', this.Sequelize.col('Name.name')), {
                        [this.Sequelize.Op.lte]: maxLength,
                    }
                )
            );
        }

        if (startsWith && endsWith) {
            where[this.Sequelize.Op.and].push(
                this.Sequelize.where(
                    this.Sequelize.col('Name.name'), {
                    [this.Sequelize.Op.like]: `${startsWith}%${endsWith}`,
                }
                )
            );
        } else if (startsWith) {
            where[this.Sequelize.Op.and].push(
                this.Sequelize.where(
                    this.Sequelize.col('Name.name'), {
                        [this.Sequelize.Op.like]: `${startsWith}%`,
                    }
                )
            );
        } else if (endsWith) {
            where[this.Sequelize.Op.and].push(
                this.Sequelize.where(
                    this.Sequelize.col('Name.name'), {
                        [this.Sequelize.Op.like]: `%${endsWith}`,
                    }
                )
            );
        }

        if (contains) {
            where[this.Sequelize.Op.and].push(
                this.Sequelize.where(
                    this.Sequelize.col('Name.name'), {
                        [this.Sequelize.Op.like]: `%${contains}%`,
                    }
                )
            );
        }

        let having = {};
        if (minOccurrences && maxOccurrences && minOccurrences === maxOccurrences) {
            having.occurrences = minOccurrences;
        } else if (minOccurrences && maxOccurrences) {
            having.occurrences = {
                [this.Sequelize.Op.between]: [minOccurrences, maxOccurrences],
            };
        } else if (minOccurrences) {
            having.occurrences = {
                [this.Sequelize.Op.gte]: minOccurrences,
            };
        } else if (maxOccurrences) {
            having.occurrences = {
                [this.Sequelize.Op.lte]: maxOccurrences,
            };
        }

        let order;
        switch (orderBy) {
            case 'name':
                order = [
                    [this.Name, 'name', sortOrder],
                    [this.Sequelize.fn('sum', this.Sequelize.col(occurrenceField)), 'DESC'],
                ];
                break;
            default:
                order = [
                    [this.Sequelize.fn('sum', this.Sequelize.col(occurrenceField)), sortOrder],
                    [this.Name, 'name', 'ASC'],
                ];
                break;
        }

        const totalResults = await this.NameByYear.findAll({
            attributes,
            where,
            group: this.Sequelize.col('Name.name'),
            having,
            order,
            raw: true,
            include: {
                model: this.Name,
                required: true,
                attributes: [],
            },
        });
        const pagedResults = totalResults.slice(pageIndex * pageSize, (pageIndex * pageSize) + pageSize);
        const paginationInfo = {
            pageIndex,
            pageSize,
            totalResults: totalResults.length,
            pageCount: Math.ceil(totalResults.length / pageSize),
        };
        return {
            pagedResults,
            totalResults,
            paginationInfo,
        };
    }

    // async getAllTimeTotals({
    //     gender = null,
    //     limit = 10,
    //     sortOrder = 'DESC',
    //     minLength = null,
    //     maxLength = null,
    //     startsWith = null,
    //     endsWith = null,
    // }) {
    //     const attributes = ['name'];
    //     if (gender === 'M') attributes.push('allTimeMaleOccurrences');
    //     else if (gender === 'F') attributes.push('allTimeFemaleOccurrences');
    //     else attributes.push('allTimeOccurrences');

    //     const where = {
    //         [this.Sequelize.Op.and]: [
    //             {
    //                 [attributes[1]]: {
    //                     [this.Sequelize.Op.gt]: 0,
    //                 },
    //             },
    //         ],
    //     };

    //     if (minLength) {
    //         where[this.Sequelize.Op.and].push(
    //             this.Sequelize.where(
    //                 this.Sequelize.fn('char_length', this.Sequelize.col('name')), {
    //                 [this.Sequelize.Op.gte]: minLength,
    //             }
    //             )
    //         );
    //     }

    //     if (maxLength) {
    //         where[this.Sequelize.Op.and].push(
    //             this.Sequelize.where(
    //                 this.Sequelize.fn('char_length', this.Sequelize.col('name')), {
    //                 [this.Sequelize.Op.lte]: maxLength,
    //             }
    //             )
    //         );
    //     }

    //     if (startsWith) {
    //         where[this.Sequelize.Op.and].push({
    //             name: {
    //                 [this.Sequelize.Op.like]: `${startsWith}%`,
    //             },
    //         });
    //     }

    //     if (endsWith) {
    //         where[this.Sequelize.Op.and].push({
    //             name: {
    //                 [this.Sequelize.Op.like]: `%${endsWith}`,
    //             },
    //         });
    //     }

    //     const results = await this.Name.findAll({
    //         attributes,
    //         order: [
    //             [attributes[1], sortOrder],
    //             'name',
    //         ],
    //         where,
    //         limit,
    //     });
    //     return results;
    // }
}

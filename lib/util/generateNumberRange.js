export default function generateNumberRange(start, end) {
    return new Array((end - start) + 1).fill(null).map((_, i) => start + i);
}

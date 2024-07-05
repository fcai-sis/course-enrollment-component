export const findDuplicateIDs = (grades: { studentId: string, Mark: number }[]): string[] => {
    const idCounts: { [key: string]: number } = {};
    const duplicates: string[] = [];

    grades.forEach(grade => {
        const id = grade.studentId;
        if (idCounts[id]) {
            idCounts[id]++;
            if (idCounts[id] === 2) {
                duplicates.push(id);
            }
        } else {
            idCounts[id] = 1;
        }
    });

    return duplicates;
};

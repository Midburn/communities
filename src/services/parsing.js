export class ParsingService {

    getGroupTypeFromString(groupType) {
        // Handle Plural values (from url)
        if (groupType[groupType.length - 1] === 's') {
            return groupType.slice(0, groupType.length - 1);
        }
        return groupType;
    }

    getGroupTypePlural(groupType) {
        // Create plural string ('s' - camps, arts etc...)
        if (groupType[groupType.length - 1] === 's') {
            return groupType;
        }
        return `${groupType}s`;
    }
}
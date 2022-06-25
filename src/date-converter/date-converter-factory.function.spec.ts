import { dateConverterFactory } from './date-converter-factory.function';

describe('Tests for dateConverter with strings', () => {
    let book: Book;
    const convertToDate = (s: string) => new Date(s);
    const convertToString = (s: Date | string) => (s instanceof Date ? s.toISOString() : s);
    const dateConverter = dateConverterFactory<Date, string>(convertToDate, convertToString);

    beforeEach(() => {
        book = getABook<string>('1212-12-12');
    });

    it('Should properly convert string date at given path to a Date object', () => {
        // Act
        const convertedBook = dateConverter<Book, Date>('details.published', book, 'object');

        // Assert
        expect(convertedBook.details.published instanceof Date).toBeTruthy();
    });

    it('Should properly convert Date at given path back to string', () => {
        // Arrange
        const aBookWithDate = dateConverter<Book, string>('details.author.born', book, 'primitive');

        // Act
        const stringDateBook = dateConverter<typeof aBookWithDate, string>('details.published', aBookWithDate, 'primitive');

        // Assert
        expect(typeof stringDateBook.details.published).toEqual('string');
    });

    it('Should not mess with other properties', () => {
        // Act
        const convertedBook = dateConverter<Book, Date>('details.published', book, 'object');

        // Assert
        expect(typeof convertedBook.details.author.name).toEqual('string');
    });

    it('Should be able to perform bulk update', () => {
        // Act
        const { details } = dateConverter<Book, Date>(['details.author.born', 'details.author.died', 'details.published'], book, 'object');

        // Assert
        expect([details.published, details.author.born].every((i) => i instanceof Date) && details.author.died === null).toBeTruthy();
    });
});

describe('Tests for dateConverter with numbers', () => {
    let book: Book<number>;
    const convertToDate = (s: number) => new Date(s);
    const convertToString = (s: Date | number) => (s instanceof Date ? s.getTime() : s);
    const dateConverter = dateConverterFactory<Date, number>(convertToDate, convertToString);

    beforeEach(() => {
        book = getABook<number>(new Date().getTime());
    });

    it('Should properly convert string date at given path to a Date object', () => {
        // Act
        const convertedBook = dateConverter<Book<number>, Date>('details.published', book, 'object');

        // Assert
        expect(convertedBook.details.published instanceof Date).toBeTruthy();
    });

    it('Should properly convert Date at given path back to number', () => {
        // Arrange
        const aBookWithDate = dateConverter<Book<number>, number>('details.author.born', book, 'primitive');

        // Act
        const stringDateBook = dateConverter<typeof aBookWithDate, number>('details.published', aBookWithDate, 'primitive');

        // Assert
        expect(typeof stringDateBook.details.published).toEqual('number');
    });

    it('Should not mess with other properties', () => {
        // Act
        const convertedBook = dateConverter<Book<number>, Date>('details.published', book, 'object');

        // Assert
        expect(typeof convertedBook.details.author.name).toEqual('string');
    });

    it('Should be able to perform bulk update', () => {
        // Act
        const { details } = dateConverter<Book<number>, Date>(
            ['details.author.born', 'details.author.died', 'details.published'],
            book,
            'object'
        );

        // Assert
        expect([details.published, details.author.born].every((i) => i instanceof Date) && details.author.died === null).toBeTruthy();
    });
});

function getABook<PrimitiveDateType>(val: PrimitiveDateType): Book<PrimitiveDateType> {
    return {
        details: {
            author: {
                born: val,
                died: null,
                name: 'Some important dude',
            },
            published: val,
            type: 'ebook',
        },
        title: 'All secrets of the universe',
    };
}

interface Book<PrimitiveDateType = string> {
    title: string;
    details: {
        type: string;
        published: Date | PrimitiveDateType;
        author: {
            name: string;
            born: Date | PrimitiveDateType;
            died: Date | PrimitiveDateType | null;
        };
    };
}

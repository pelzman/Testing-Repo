"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.findById = exports.getBooks = exports.addBook = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
let dataBaseFolder = path_1.default.join(__dirname, "../../bookDatabase");
let dataBaseFile = path_1.default.join(dataBaseFolder, "bookDatabase.json");
const addBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //  create dynamic database
    try {
        if (!fs_1.default.existsSync(dataBaseFolder)) {
            fs_1.default.mkdirSync(dataBaseFolder);
        }
        if (!fs_1.default.existsSync(dataBaseFile)) {
            fs_1.default.writeFileSync(dataBaseFile, "");
        }
        let allBooks = [];
        try {
            const data = fs_1.default.readFileSync(dataBaseFile, "utf-8");
            if (!data) {
                res.status(401).json({
                    message: "Error Reading from Database"
                });
            }
            else {
                allBooks = JSON.parse(data);
            }
        }
        catch (parseError) {
            allBooks = [];
        }
        // Feedback from Frontend
        const bodyData = req.body;
        let bookExist = allBooks.find((book) => book.title === bodyData.title);
        if (bookExist) {
            return res.send({
                message: `The book with title ${bodyData.title} already exist`
            });
        }
        //    create newBook
        const newBook = {
            bookId: (0, uuid_1.v4)(),
            title: bodyData.title,
            author: bodyData.author,
            datePublished: bodyData.datePublished,
            description: bodyData.description,
            pageCount: bodyData.pageCount,
            genre: bodyData.genre,
            publisher: bodyData.publisher,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        allBooks.push(newBook);
        // Write to database
        fs_1.default.writeFile(dataBaseFile, JSON.stringify(allBooks, null, 2), "utf-8", (err) => {
            if (err) {
                return res.status(500).json({
                    message: "You  do not have access to this book"
                });
            }
            else {
                return res.status(200).json({
                    message: "Book Created Successfully",
                    newBook
                });
            }
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.addBook = addBook;
// GET ALLBOOKS
const getBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let getAllBooks = [];
    try {
        const data = fs_1.default.readFileSync(dataBaseFile, "utf-8");
        getAllBooks = JSON.parse(data);
        return res.status(200).json(getAllBooks);
    }
    catch (Error) {
        return res.status(500).json({
            message: `Failed to retrieve books from database`
        });
    }
});
exports.getBooks = getBooks;
//   UPDATE
const findById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let info = fs_1.default.readFileSync(dataBaseFile, 'utf8');
        if (!info)
            return res.send({ message: `Cannot read from database` });
        let allBooks = JSON.parse(info);
        let body = req.body;
        let id = req.params.id;
        let actualBook = allBooks.find((book) => book.bookId === id);
        if (!actualBook)
            return res.status(401).send({
                error: true,
                message: "Book not found"
            });
        console.log(body);
        let newBook = {
            bookId: actualBook.bookId,
            title: body.title || actualBook.title,
            author: body.author || actualBook.author,
            datePublished: body.datePublished || actualBook.datePublished,
            description: body.description || actualBook.description,
            pageCount: body.pageCount || actualBook.pageCount,
            genre: body.genre || actualBook.genre,
            publisher: body.publisher || actualBook.publisher,
            createdAt: actualBook.createdAt,
            updatedAt: new Date(),
        };
        let bookIndex = allBooks.findIndex((book) => book.bookId === id);
        allBooks[bookIndex] = newBook;
        fs_1.default.writeFileSync(dataBaseFile, JSON.stringify(allBooks, null, 2), 'utf-8');
        return res.status(200).json({
            status: `Success`,
            book: newBook,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: `Error updating` });
    }
});
exports.findById = findById;
//  DELETE
const deleteBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let allBooks = [];
    try {
        const infos2 = fs_1.default.readFileSync(dataBaseFile, "utf-8");
        if (!infos2) {
            return res.status(400).json({
                message: `This book cannot be accessed`,
            });
        }
        else {
            allBooks = JSON.parse(infos2);
            const { title, author, datePublished, description, pageCount, genre, bookId, publisher, } = req.body;
            let getBooks = allBooks.findIndex((a) => a.title === req.body.title);
            allBooks[getBooks] = req.body;
            let delBooks = allBooks.findIndex((a) => a.title === req.body.title); //check if you can add Index to addAllData
            allBooks.splice(delBooks, 1);
            fs_1.default.writeFile(dataBaseFile, JSON.stringify(allBooks, null, 2), "utf-8", (err) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Book not found',
                    });
                }
                else {
                    return res.status(200).json({
                        message: "delected successfully"
                    });
                }
            });
        }
    }
    catch (err) {
        return res.status(401).json({
            message: `Failed to DELETE the book`,
        });
    }
});
exports.deleteBook = deleteBook;

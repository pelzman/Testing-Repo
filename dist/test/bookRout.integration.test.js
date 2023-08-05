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
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const books_1 = __importDefault(require("../routes/books"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/books", books_1.default);
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc1M2VlOWRmLTE3MDctNGY3Mi04OTRmLTdkMGZhODFiNDQxMSIsInVzZXJOYW1lIjoid2FsZTMzICIsImVtYWlsIjoiZXhjQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJDJWNElVUVpjUEc0eE0ydVBwcVdiYi5KT3VVYlFFWGk1UTY5SldQekszekY0Y0M0Mm1XY1M2IiwiY3JlYXRlQXQiOiIyMDIzLTA2LTI4VDA5OjM5OjQ1LjYzM1oiLCJ1cGRhdGVkQXQiOiIyMDIzLTA2LTI4VDA5OjM5OjQ1LjYzM1oiLCJpYXQiOjE2ODc5NDUyNDN9.Pnfg6gd46N37I9PCRBta0zFjbVr7Uyb-4lxWwFQYVtQ";
describe('integration test for book API', () => {
    describe('integration tests for the book library', () => {
        it('GET /books/getbooks - success - get all the books', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body, statusCode } = yield (0, supertest_1.default)(app).get('/books/getbook').set("authorization", `Bearer ${token}`);
            expect(body).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    "bookId": "9b55277a-a2e1-4b98-9406-545a97502b5c",
                    "title": "es444 ",
                    "author": "Barack  ",
                    "datePublished": "2020-0-12T19:0455.455z",
                    "description": "A Promised Land is a memoir by Barack Obama, the 44th President of the United States from 2009 to 2017. Published on November 17, 2020, it is the first of a planned two-volume series",
                    "pageCount": 767,
                    "genre": "autobiography",
                    "publisher": "Crown",
                    "createdAt": "2023-06-28T09:41:34.780Z",
                    "updatedAt": "2023-06-28T09:41:34.780Z"
                }),
            ]));
            expect(statusCode).toBe(200);
        }));
    });
    describe("POST /add - success- create book", () => {
        test('should respond with a 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).post('/books/add').send({
                title: "title",
                author: "author",
                datePublished: "datePublished",
                description: "description",
                pageCount: "pageCount",
                genre: "genre",
                publisher: "publisher",
                createdAt: new Date(),
                updatedAt: new Date()
            }).set("authorization", `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
        }));
        test('should specify json in the content type header', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).post('/books/add').send({
                title: "title",
                author: "author",
                datePublished: "datePublished",
                description: "description",
                pageCount: "pageCount",
                genre: "genre",
                publisher: "publisher",
                createdAt: new Date(),
                updatedAt: new Date()
            });
            expect(response.headers[`content-type`]).toEqual(expect.stringContaining("json"));
        }));
    });
    describe("PUT /add - Failure- updated book", () => {
        test('should respond with a 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).put('/books/500').send({
                title: "esckkk ",
                author: "Barack pabo ",
            });
            expect(response.statusCode).toBe(401);
            expect(response.body).toEqual({
                error: true,
                message: expect.any(String)
            });
        }));
    });
    describe("DELETE /add - success- updated book", () => {
        test('should respond with a 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).delete('/books/b1da45ff-1495-4afd-b3c2-5b7c28ab7184');
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                message: "delected successfully"
            });
        }));
    });
});

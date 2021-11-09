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
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserService_1 = __importDefault(require("../Services/UserService"));
const config_1 = require("../config/config");
const token_middleware_1 = require("../middlewares/token.middleware");
const router = (0, express_1.Router)();
const listUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let users;
        if (req.query.type !== null) {
            if (req.query.type === 'pending') {
                users = yield UserService_1.default
                    .listPending(Number(req.query.limit), Number(req.query.offset), String(req.query.search));
            }
            else if (req.query.type === 'approved') {
                users = yield UserService_1.default
                    .listApproved(Number(req.query.limit), Number(req.query.offset), String(req.query.search));
            }
            else if (req.query.type === 'clients') {
                users = yield UserService_1.default
                    .listClients(Number(req.query.limit), Number(req.query.offset), String(req.query.search));
            }
            else if (req.query.type === 'admins') {
                users = yield UserService_1.default
                    .listAdmins(Number(req.query.limit), Number(req.query.offset), String(req.query.search));
            }
            else {
                return res.status(400).json({ error: 'Invalid type' });
            }
        }
        else {
            users = yield UserService_1.default
                .listAll(Number(req.query.limit), Number(req.query.offset));
        }
        return res.status(200).send(users);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserService_1.default.create(req.body);
        return res.status(200).send(user);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserService_1.default.update(Number(req.params.id), req.body);
        return res.status(200).send(user);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserService_1.default.password(Number(req.params.id), req.body);
        return res.status(200).send(user);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const approve = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserService_1.default.approve(Number(req.params.id));
        return res.status(200).send(user);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const cancel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserService_1.default.cancel(Number(req.params.id));
        return res.status(200).send(user);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const giveAdminPermission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserService_1.default.giveAdminPermission(Number(req.params.id));
        return res.status(200).send(user);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const removeAdminPermission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserService_1.default.removeAdminPermission(Number(req.params.id));
        return res.status(200).send(user);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const active = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserService_1.default.active(Number(req.params.id));
        return res.status(200).send(user);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logged = yield UserService_1.default.login(req.body);
        const token = jsonwebtoken_1.default.sign({
            user: logged.get('id'),
            role: logged.get('type'),
        }, config_1.secret.auth, {
            expiresIn: '2d',
        });
        return res.status(200).send({
            token,
            user: logged,
        });
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const checkUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).send(req.auth);
    }
    catch (error) {
        return res.status(400).send();
    }
});
const validate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    if (token) {
        jsonwebtoken_1.default.verify(token, config_1.secret.auth, (error, decoded) => {
            if (error) {
                const message = 'Invalid token';
                return res.status(401).send({ message });
            }
            const userId = decoded.user;
            return res.status(200).send({ userId });
        });
    }
    else {
        return res.status(400).send('auth token not supplied');
    }
    return res.status(500).send();
});
const listUsersById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userIds } = req.body;
        const users = yield UserService_1.default.listUsersById(userIds);
        return res.status(200).send(users);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.params.id);
        const user = yield UserService_1.default.getUser(userId);
        return res.status(200).send(user);
    }
    catch (error) {
        const e = error;
        return res.status(400).json({ error: e.message });
    }
});
router.route('/login')
    .post(login);
router.route('/')
    .post(create);
router.post('/validate', validate);
router.use('/', token_middleware_1.authorized);
router.route('/check-user')
    .post(checkUser);
router.route('/')
    .get(listUsers);
router.route('/:id')
    .get(getUser)
    .put(update)
    .patch(active);
router.route('/:id/password')
    .put(password);
router.route('/:id/approve')
    .put(approve);
router.route('/:id/active')
    .patch(active);
router.route('/:id/cancel')
    .put(cancel);
router.route('/:id/admin')
    .put(giveAdminPermission);
router.route('/:id/client')
    .put(removeAdminPermission);
router.route('/usersById')
    .post(listUsersById);
exports.default = router;
//# sourceMappingURL=UserCotroller.js.map
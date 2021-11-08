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
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
const index_enum_1 = require("../enums/index.enum");
const users_model_1 = require("../models/users.model");
const listPending = (limit, offset, search) => __awaiter(void 0, void 0, void 0, function* () {
    let options = {};
    if (limit >= 1 && offset >= 0) {
        if (search && search !== '') {
            options = {
                where: {
                    status: index_enum_1.status.pending,
                    [sequelize_1.Op.or]: [
                        { name: { [sequelize_1.Op.substring]: search } },
                        { email: { [sequelize_1.Op.substring]: search } },
                    ],
                },
                limit,
                offset,
            };
        }
        else {
            options = {
                where: {
                    status: index_enum_1.status.pending,
                },
                limit,
                offset,
            };
        }
    }
    return users_model_1.User.findAndCountAll(Object.assign({ attributes: [
            'id', 'name', 'email', 'organization', 'type', 'status', 'active', 'createdAt',
        ], order: [
            ['createdAt', 'ASC'],
        ] }, options));
});
const listApproved = (limit, offset, search) => __awaiter(void 0, void 0, void 0, function* () {
    let options = {};
    if (limit >= 1 && offset >= 0) {
        if (search && search !== '') {
            options = {
                where: {
                    status: index_enum_1.status.approved,
                    [sequelize_1.Op.or]: [
                        { name: { [sequelize_1.Op.substring]: search } },
                        { email: { [sequelize_1.Op.substring]: search } },
                    ],
                },
                limit,
                offset,
            };
        }
        else {
            options = {
                where: {
                    status: index_enum_1.status.approved,
                },
                limit,
                offset,
            };
        }
    }
    return users_model_1.User.findAndCountAll(Object.assign({ attributes: [
            'id', 'name', 'email', 'organization', 'type', 'status', 'active', 'createdAt',
        ], order: [
            ['createdAt', 'ASC'],
        ] }, options));
});
const listClients = (limit, offset, search) => __awaiter(void 0, void 0, void 0, function* () {
    let options = {};
    if (limit >= 1 && offset >= 0) {
        if (search && search !== '') {
            options = {
                where: {
                    status: index_enum_1.status.approved,
                    type: index_enum_1.profiles.client,
                    [sequelize_1.Op.or]: [
                        { name: { [sequelize_1.Op.substring]: search } },
                        { email: { [sequelize_1.Op.substring]: search } },
                    ],
                },
                limit,
                offset,
            };
        }
        else {
            options = {
                where: {
                    status: index_enum_1.status.approved,
                    type: index_enum_1.profiles.client,
                },
                limit,
                offset,
            };
        }
    }
    return users_model_1.User.findAndCountAll(Object.assign({ attributes: [
            'id', 'name', 'email', 'organization', 'type', 'status', 'active', 'createdAt',
        ], order: [
            ['createdAt', 'ASC'],
        ] }, options));
});
const listAdmins = (limit, offset, search) => __awaiter(void 0, void 0, void 0, function* () {
    let options = {};
    if (limit >= 1 && offset >= 0) {
        if (search && search !== '') {
            options = {
                where: {
                    status: index_enum_1.status.approved,
                    type: index_enum_1.profiles.administrator,
                    [sequelize_1.Op.or]: [
                        { name: { [sequelize_1.Op.substring]: search } },
                        { email: { [sequelize_1.Op.substring]: search } },
                    ],
                },
                limit,
                offset,
            };
        }
        else {
            options = {
                where: {
                    status: index_enum_1.status.approved,
                    type: index_enum_1.profiles.administrator,
                },
                limit,
                offset,
            };
        }
    }
    return users_model_1.User.findAndCountAll(Object.assign({ attributes: [
            'id', 'name', 'email', 'organization', 'type', 'status', 'active', 'createdAt',
        ], order: [
            ['createdAt', 'ASC'],
        ] }, options));
});
const listAll = (limit, offset) => __awaiter(void 0, void 0, void 0, function* () {
    let options = {};
    if (limit >= 1 && offset >= 0) {
        options = {
            limit,
            offset,
        };
    }
    return users_model_1.User.findAndCountAll(Object.assign({ attributes: [
            'id', 'name', 'email', 'organization', 'type', 'status', 'active', 'createdAt',
        ], order: [
            ['createdAt', 'ASC'],
        ] }, options));
});
const create = (userDTO) => __awaiter(void 0, void 0, void 0, function* () {
    return users_model_1.User.findOne({
        where: {
            email: userDTO.email,
        },
    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (user) {
            throw new Error('email is taken');
        }
        else {
            // se hace el checkeo antes porque luego se encripta
            if (userDTO.password.length >= 6) {
                const newUser = yield users_model_1.User.create({
                    name: userDTO.name,
                    email: userDTO.email,
                    organization: userDTO.organization,
                    password: bcrypt_1.default.hashSync(userDTO.password, 10),
                    type: index_enum_1.profiles.client,
                    status: index_enum_1.status.pending,
                    createdBy: 1,
                    createdAt: new Date(),
                }).catch((error) => {
                    console.log(error);
                    throw new Error('create user error');
                });
                newUser.toJSON();
                return newUser;
            }
            throw new Error('password too short');
        }
    })).catch((error) => {
        console.log(error);
        throw error;
    });
});
const update = (userId, userDTO) => __awaiter(void 0, void 0, void 0, function* () {
    return users_model_1.User.findOne({
        attributes: [
            'id', 'name', 'email',
        ],
        where: {
            id: userId,
        },
    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new Error('user not found');
        }
        else if (userDTO.password && userDTO.password.length >= 6) {
            if (userDTO.password === userDTO.repeat) {
                return user.update({
                    name: userDTO.name,
                    organization: userDTO.organization,
                    password: bcrypt_1.default.hashSync(userDTO.password, 10),
                    updatedAt: new Date(),
                }).catch((error) => {
                    console.log(error);
                    throw new Error('user update error');
                });
            }
            throw new Error('passwords dont match');
        }
        else {
            return user.update({
                name: userDTO.name,
                organization: userDTO.organization,
                updatedAt: new Date(),
            }).catch((error) => {
                console.log(error);
                throw new Error('user update error');
            });
        }
    })).catch((error) => {
        console.log(error);
        throw new Error('find user error');
    });
});
const password = (userId, userDTO) => __awaiter(void 0, void 0, void 0, function* () {
    return users_model_1.User.findOne({
        attributes: [
            'id', 'name', 'email',
        ],
        where: {
            id: userId,
        },
    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new Error('user not found');
        }
        else {
            return user.update({
                password: bcrypt_1.default.hashSync(userDTO.password, 10),
                updatedAt: new Date(),
            }).catch((error) => {
                console.log(error);
                throw new Error('user update error');
            });
        }
    })).catch((error) => {
        console.log(error);
        throw new Error('find user error');
    });
});
const approve = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return users_model_1.User.findOne({
        attributes: [
            'id', 'name',
            'email', 'type',
            'createdAt',
        ],
        where: {
            id: userId,
        },
    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new Error('user not found');
        }
        else {
            return user.update({
                status: index_enum_1.status.approved,
                updatedAt: new Date(),
            }).catch((error) => {
                console.log(error);
                throw new Error('user update error');
            });
        }
    })).catch((error) => {
        console.log(error);
        throw new Error('find user error');
    });
});
const cancel = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return users_model_1.User.findOne({
        attributes: [
            'id', 'name',
            'email', 'type',
            'createdAt',
        ],
        where: {
            id: userId,
        },
    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new Error('user not found');
        }
        else {
            return user.update({
                status: index_enum_1.status.pending,
                type: index_enum_1.profiles.client,
                updatedAt: new Date(),
            }).catch((error) => {
                console.log(error);
                throw new Error('user update error');
            });
        }
    })).catch((error) => {
        console.log(error);
        throw new Error('find user error');
    });
});
const giveAdminPermission = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return users_model_1.User.findOne({
        attributes: [
            'id', 'name',
            'email', 'type',
            'createdAt',
        ],
        where: {
            id: userId,
        },
    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new Error('user not found');
        }
        else {
            return user.update({
                type: index_enum_1.profiles.administrator,
                updatedAt: new Date(),
            }).catch((error) => {
                console.log(error);
                throw new Error('user update error');
            });
        }
    })).catch((error) => {
        console.log(error);
        throw new Error('find user error');
    });
});
const removeAdminPermission = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return users_model_1.User.findOne({
        attributes: [
            'id', 'name',
            'email', 'type',
            'createdAt',
        ],
        where: {
            id: userId,
        },
    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new Error('user not found');
        }
        else {
            return user.update({
                type: index_enum_1.profiles.client,
                updatedAt: new Date(),
            }).catch((error) => {
                console.log(error);
                throw new Error('user update error');
            });
        }
    })).catch((error) => {
        console.log(error);
        throw new Error('find user error');
    });
});
const active = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return users_model_1.User.findOne({
        where: {
            id: userId,
        },
    }).then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            throw new Error('user not found');
        }
        else {
            return user.update({
                active: !user.get('active'),
                updatedAt: new Date(),
            }).catch((error) => {
                throw new Error('user update error');
            });
        }
    })).catch((error) => {
        console.log(error);
        throw new Error('find user error');
    });
});
const login = (userDTO) => __awaiter(void 0, void 0, void 0, function* () {
    return users_model_1.User.findOne({
        attributes: [
            'id', 'name', 'email', 'organization', 'password',
            'type', 'status', 'active', 'createdAt',
        ],
        where: {
            email: userDTO.email,
            status: index_enum_1.status.approved,
            active: true,
        },
    }).then((user) => {
        if (!user) {
            throw new Error('user not found');
        }
        else if (user && bcrypt_1.default.compareSync(userDTO.password, String(user.get('password')))) {
            return user;
        }
        else {
            throw new Error('auth failed');
        }
    }).catch((error) => {
        console.log(error);
        throw new Error('find user error');
    });
});
const listUsersById = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    const users = users_model_1.User.findAll({
        attributes: [
            'id', 'name', 'email', 'organization', 'type',
        ],
        where: { id: { [sequelize_1.Op.in]: ids } },
    });
    return users;
});
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return users_model_1.User.findOne({
        attributes: ['id', 'name', 'organization'],
        where: {
            id,
            deletedAt: null,
        },
    });
});
exports.default = {
    listAll,
    listPending,
    listApproved,
    listClients,
    listAdmins,
    create,
    update,
    password,
    approve,
    cancel,
    active,
    giveAdminPermission,
    removeAdminPermission,
    login,
    listUsersById,
    getUser,
};
//# sourceMappingURL=UserService.js.map
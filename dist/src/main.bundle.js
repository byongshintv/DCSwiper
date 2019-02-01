/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/controller/cleaner.ts":
/*!***********************************!*\
  !*** ./src/controller/cleaner.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Cleaner {
    constructor(dcBoard, datas, gui, logger) {
        this._dcBoard = dcBoard;
        this._allDatas = datas;
        this._datas = datas.dbs;
        this._gui = gui;
        this._logging = logger.get("cleaner");
    }
    _getProblemList(datas) {
        const result = [];
        datas.forEach((data) => {
            const targetBoardDatas = this._dcBoard.inspect(data.condition);
            if (targetBoardDatas.length == 0)
                return;
            targetBoardDatas.forEach((board) => {
                result.push({
                    board: board,
                    dbData: data
                });
            });
        });
        return result;
    }
    _getRemoveList(datas) {
        return datas
            .filter((data) => data.dbData.isRemove)
            .map((data) => ({
            id: data.board.id,
            $dom: data.board.$dom
        }));
    }
    _getBlockList(datas) {
        return datas
            .filter((data) => data.dbData.block.isBlock)
            .map((data) => ({
            id: data.board.id,
            length: data.dbData.block.length,
            reason: data.dbData.block.reason,
            $dom: data.board.$dom
        }));
    }
    conductBlock(blockList) {
        blockList.forEach((blockNode) => {
            this._gui.clickBlock(blockNode);
        });
        return blockList;
    }
    conductRemove(removeNodes) {
        this._gui.clickRemove(removeNodes);
        return removeNodes;
    }
    isLimitCountOver(removeNode) {
        if (this._allDatas.setting.removeLimit === undefined)
            return false;
        return removeNode.length >= this._allDatas.setting.removeLimit;
    }
    /**
     * 차단, 삭제작업을 수행한 후 결과 보고
     */
    start() {
        const datas = this._datas;
        const problemDatas = this._getProblemList(datas);
        this._logging.debug("삭제 혹은 차단의 대상이 되는 요소", problemDatas);
        const removeList = this._getRemoveList(problemDatas);
        const blockList = this._getBlockList(problemDatas);
        if (!this.isLimitCountOver(removeList)) {
            const blockResult = this.conductBlock(blockList);
            const removeResult = this.conductRemove(removeList);
            return {
                remove: removeResult,
                block: blockResult
            };
        }
        return {
            remove: [],
            block: []
        };
    }
}
exports.default = Cleaner;


/***/ }),

/***/ "./src/controller/cleanerGUI.ts":
/*!**************************************!*\
  !*** ./src/controller/cleanerGUI.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @param e
 */
function getCookie(e) {
    for (var t = e + "=", o = document.cookie.split(";"), i = 0; i < o.length; i++) {
        for (var n = o[i]; " " == n.charAt(0);)
            n = n.substring(1);
        if (0 == n.indexOf(t))
            return n.substring(t.length, n.length);
    }
    return "";
}
var GUIalertInfo_ClassType;
(function (GUIalertInfo_ClassType) {
    GUIalertInfo_ClassType["WARNING"] = "hsl(61, 100%, 87%)";
    GUIalertInfo_ClassType["ERROR"] = "hsl(0, 100%,87%)";
})(GUIalertInfo_ClassType || (GUIalertInfo_ClassType = {}));
/**
 * 실제 차단과 관련된 작업을 수행하는 클래스
 */
class CleanerGUI {
    constructor(datas, logging) {
        this._logging = logging.get("CleanerGUI");
    }
    /**
     * 글의 id값으로 tr 엘리멘트 획득
     * @param id 포스트의 id
     */
    _getPostTrElement(id) {
        return $(`.ub-content[data-no=${id}]`);
    }
    /**
     * 게시글이 삭제되면 안되는 게시글인지 체크,
     * ex) 공지사항이나 설문조사인 경우
     * @param id 체크할 게시글의 id
     */
    _isSignificantPost(id) {
        const $tr = this._getPostTrElement(id);
        const gallNum = $tr.find(".gall_num").text();
        return ["공지", "설문"].includes(gallNum) ? true : false;
    }
    /**
     * 특정 게시물 체크박스 활성화
     * 공지나 설문조사 게시물이면 체크하지 않음
     * @param id 체크할 게시물의 id
     */
    check(id, ischeck = true) {
        // id의 타입이 array인 경우
        if (id instanceof Array) {
            id.forEach(singleId => this.check(singleId));
            return;
        }
        // id의 타입이 number인 경우
        if (this._isSignificantPost(id))
            return;
        const checkbox = this._getPostTrElement(id).find("list_chkbox");
        checkbox[0].checked = ischeck;
    }
    /**
     * 눈에 보이는 게시물의 모든 id 획득
     */
    getAllIds() {
        return $(".gall_list tr")
            .toArray()
            .map(el => $(el).data("no"))
            .filter(id => id !== undefined);
    }
    /**
     * 화면에 보이는 게시글 테이블의 모든 체크박스 체크
     */
    checkAll(ischeck) {
        const ids = this.getAllIds();
        this.check(ids, ischeck);
    }
    /**
     * 게시글을 남긴 특정유저 차단
     * @param blockNode 차단 데이터가 담긴 객체
     * @param callback 차단 성공시 콜백
     * @param errCallback 차단 실패시 콜백
     */
    clickBlock(blockNode, callback = (data) => { }, errCallback = (data) => { }) {
        const allVals = [blockNode.id].map(v => v + "");
        const data = {
            ci_t: getCookie('ci_c'),
            id: $("#gallery_id").val(),
            nos: allVals,
            avoid_hour: blockNode.length,
            avoid_reason: "0",
            parent: "",
            avoid_reason_txt: blockNode.reason
        };
        this._logging.debug("차단작업 수행 폼 데이터", data);
        $.ajax({
            type: "POST",
            dataType: 'json',
            cache: false,
            url: "/ajax/minor_manager_board_ajax/update_avoid_list",
            data: data,
            success: (data) => callback(data),
            error: (data) => errCallback(data),
        });
    }
    /**
     * 특정 게시글 삭제
     * @param removeNodes 게시글을 삭제할 정보가담긴 객체
     * @param callback 게시글 삭제 성공시 콜백
     * @param errCallback 게시글 삭제 실패시 콜백
     */
    clickRemove(removeNodes, callback = (data) => { }, errCallback = (data) => { }) {
        var nos = removeNodes.map(v => v.id);
        if (nos.length === 0)
            return;
        this._logging.debug("삭제작업 수행 폼 데이터", nos);
        $.ajax({
            type: "POST",
            url: "/ajax/minor_manager_board_ajax/delete_list",
            data: {
                'ci_t': getCookie('ci_c'),
                'id': $("#gallery_id").val(),
                'nos': nos
            },
            dataType: 'json',
            success: (data) => callback(data),
            error: (data) => errCallback(data)
        });
    }
    _getAlertList(cleanerResults) {
        const alertList = [];
        cleanerResults.remove.forEach(result => {
            alertList.push({
                $dom: result.$dom,
                classType: GUIalertInfo_ClassType.WARNING,
                detail: "삭제됨 ",
            });
        });
        cleanerResults.block.forEach(result => {
            alertList.push({
                $dom: result.$dom,
                classType: GUIalertInfo_ClassType.ERROR,
                detail: `${result.reason}로 ${result.length}시간 차단됨 `,
            });
        });
        return alertList;
    }
    _alertToDom(alertList) {
        alertList.forEach((alertinfo) => {
            alertinfo.$dom.css("background-color", alertinfo.classType)
                .find(".gall_tit").append(`<small>${alertinfo.detail}</small>`);
        });
    }
    /**
     * 삭제 및 차단 결과를 받아 실제 dom에 표시
     * @param result
     */
    doAlert(result) {
        const alertList = this._getAlertList(result);
        this._alertToDom(alertList);
    }
}
exports.default = CleanerGUI;


/***/ }),

/***/ "./src/interface/DBData.ts":
/*!*********************************!*\
  !*** ./src/interface/DBData.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DBDATA_CONDITIONTARGET;
(function (DBDATA_CONDITIONTARGET) {
    DBDATA_CONDITIONTARGET[DBDATA_CONDITIONTARGET["NAME"] = 0] = "NAME";
    DBDATA_CONDITIONTARGET[DBDATA_CONDITIONTARGET["TITLE"] = 2] = "TITLE";
    DBDATA_CONDITIONTARGET[DBDATA_CONDITIONTARGET["IP"] = 1] = "IP";
    DBDATA_CONDITIONTARGET[DBDATA_CONDITIONTARGET["ID"] = 3] = "ID";
})(DBDATA_CONDITIONTARGET || (DBDATA_CONDITIONTARGET = {}));
exports.DBDATA_CONDITIONTARGET = DBDATA_CONDITIONTARGET;
var DBDATA_CONDITIONTYPE;
(function (DBDATA_CONDITIONTYPE) {
    DBDATA_CONDITIONTYPE[DBDATA_CONDITIONTYPE["STRING"] = 0] = "STRING";
    DBDATA_CONDITIONTYPE[DBDATA_CONDITIONTYPE["REGEX"] = 1] = "REGEX";
})(DBDATA_CONDITIONTYPE || (DBDATA_CONDITIONTYPE = {}));
exports.DBDATA_CONDITIONTYPE = DBDATA_CONDITIONTYPE;


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DCBoard_1 = __importDefault(__webpack_require__(/*! ./model/DCBoard */ "./src/model/DCBoard.ts"));
const DBDataModel_1 = __importDefault(__webpack_require__(/*! ./model/DBDataModel */ "./src/model/DBDataModel.ts"));
const cleanerGUI_1 = __importDefault(__webpack_require__(/*! ./controller/cleanerGUI */ "./src/controller/cleanerGUI.ts"));
const cleaner_1 = __importDefault(__webpack_require__(/*! ./controller/cleaner */ "./src/controller/cleaner.ts"));
const logger_1 = __importDefault(__webpack_require__(/*! ./utils/logger */ "./src/utils/logger.js"));
const logger = logger_1.default;
logger.useDefaults({
    defaultLevel: logger_1.default.DEBUG,
    formatter: function (messages, context) {
        messages.unshift(new Date().toUTCString());
    }
});
function onGalleryLoad() {
    const dataModel = new DBDataModel_1.default();
    dataModel.loadData()
        .then((datas) => {
        const dcBoard = new DCBoard_1.default();
        const gui = new cleanerGUI_1.default(datas, logger);
        const cleaner = new cleaner_1.default(dcBoard, datas, gui, logger);
        const result = cleaner.start();
        gui.doAlert(result);
        //재시작
        if (datas.setting.autoRefresh !== undefined)
            setTimeout(() => {
                location = location;
            }, datas.setting.autoRefresh * 10);
    });
}
onGalleryLoad();


/***/ }),

/***/ "./src/model/DBDataModel.ts":
/*!**********************************!*\
  !*** ./src/model/DBDataModel.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class DBDataModel {
    constructor() {
        this._databaseName = "Swiper" + "_" + new URL(location.href).searchParams.get("id");
        this._defaultForm = {
            dbs: []
        };
    }
    loadData() {
        const promise = new Promise((res, rej) => this._hasNotData(res)).then((hasNotData) => new Promise((res) => {
            if (hasNotData)
                this._createNewData(res);
            else
                res();
        })).then(() => new Promise((res) => {
            this._loadData(res);
        })).then((result) => new Promise((res) => {
            res(result);
        }));
        return promise;
    }
    _createNewData(resolve) {
        chrome.storage.sync.set({ [this._databaseName]: this._defaultForm }, () => {
            resolve();
        });
    }
    _loadData(resolve) {
        const databaseName = this._databaseName;
        chrome.storage.sync.get(this._databaseName, (result) => {
            resolve(result[databaseName]);
        });
    }
    _hasNotData(resolve) {
        const databaseName = this._databaseName;
        new Promise((res) => {
            this._loadData(res);
        }).then(result => {
            resolve(result == undefined);
        });
    }
}
exports.default = DBDataModel;


/***/ }),

/***/ "./src/model/DCBoard.ts":
/*!******************************!*\
  !*** ./src/model/DCBoard.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const DBData_1 = __webpack_require__(/*! ../interface/DBData */ "./src/interface/DBData.ts");
const debug = {
    message: (...m) => 123
};
/*
    게시글 하나에 해당하는 파싱된 인터페이스
*/
class DCBoard {
    constructor() {
        this._datas = this._parse();
    }
    /**
     * 생성자의 하위 메서드, 돔요소를 BoardData의 배열로 반환함
     * @returns 데이터로 저장할 BoardData의 배열형태
    */
    _parse() {
        const $dom = this._getJqueryArrayFromDOM();
        return this._parseDOMToObject($dom);
    }
    /**
     * 디씨 게시글에 해당되는 돔요소를 긁어와 JQuery 오브젝트 형태로 변환, 공지사항만 필터링
     * @return 변환된 JQuery 오브젝트
     */
    _getJqueryArrayFromDOM() {
        let $dom = $(".gall_list tbody > tr")
            .filter((i, d) => !["설문", "이슈", "공지"].includes($(d).find(".gall_num").text()));
        return $dom;
    }
    /**
     * JQuery오브젝트를 BoardData의 배열형태로 변환
     * @param $dom 변환 대상이 될 JQuery 오브젝트
     * @return 변환된 BoardData의 배열
     */
    _parseDOMToObject($dom) {
        let $boardDatas = $dom.map((i, d) => {
            const getHTML = (selector) => $(d).find(selector).text();
            const isLogin = $(d).find(".ip").length == 1;
            let data = {
                user: {
                    name: getHTML(".nickname"),
                    isLogin,
                },
                title: getHTML(".gall_tit a"),
                id: parseInt($(d).data("no")),
                $dom: $(d)
            };
            if (isLogin) {
                data.user.isRightNick = $(d).find(".writer_nikcon img").attr("src") != "http://nstatic.dcinside.com/dc/w/images/nik.gif";
                data.user.id = $(d).find(".gall_writer").data("uid");
            }
            else {
                data.user.ip = $(d).find(".gall_writer").data("ip");
            }
            return data;
        });
        return $boardDatas.toArray();
    }
    /**
     * 파라미터로 제시한 조건을 충족하는 게시글을 배열로 반환
     * 조건은 and연산됨
     * @param conditions 제시한 조건
     */
    inspect(conditions) {
        const result = [];
        this._datas.forEach(data => {
            debug.message(data, conditions, "조건검사");
            if (this._inspectSingle(data, conditions))
                result.push(data);
        });
        return result;
    }
    /**
     * 게시글 하나가 and연산으로 조건에 충족되는지 검사
     * @param data 검사할 게시글
     * @param conditions 조건
     */
    _inspectSingle(data, conditions) {
        const getValue = (target, data) => {
            let value = null;
            switch (target) {
                case DBData_1.DBDATA_CONDITIONTARGET.IP:
                    if (!data.user.isLogin)
                        value = data.user.ip;
                    break;
                case DBData_1.DBDATA_CONDITIONTARGET.NAME:
                    value = data.user.name;
                    break;
                case DBData_1.DBDATA_CONDITIONTARGET.TITLE:
                    value = data.title;
                    break;
                case DBData_1.DBDATA_CONDITIONTARGET.ID:
                    if (data.user.isLogin)
                        value = data.user.id;
                    break;
                default:
            }
            return value;
        };
        const getRegex = (condition) => {
            let regex = "";
            switch (condition.type) {
                case DBData_1.DBDATA_CONDITIONTYPE.REGEX:
                    regex = new RegExp(condition.test);
                    break;
                case DBData_1.DBDATA_CONDITIONTYPE.STRING:
                    regex = condition.test;
                    break;
            }
            return regex;
        };
        // 모든 조건 충족시 false 반환
        return conditions.every(condition => {
            let regex = getRegex(condition);
            let value = getValue(condition.target, data);
            debug.message(regex, value, "상세조건검사");
            if (value == null)
                return true;
            if (value.match(regex) != null)
                return true;
            else
                return false;
        });
    }
    getBoardDatas() {
        return this._datas;
    }
}
exports.default = DCBoard;


/***/ }),

/***/ "./src/utils/logger.js":
/*!*****************************!*\
  !*** ./src/utils/logger.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * js-logger - http://github.com/jonnyreeves/js-logger
 * Jonny Reeves, http://jonnyreeves.co.uk/
 * js-logger may be freely distributed under the MIT license.
 */
(function (global) {
	"use strict";

	// Top level module for the global, static logger instance.
	var Logger = { };

	// For those that are at home that are keeping score.
	Logger.VERSION = "1.7.0-next";

	// Function which handles all incoming log messages.
	var logHandler;

	// Map of ContextualLogger instances by name; used by Logger.get() to return the same named instance.
	var contextualLoggersByNameMap = {};

	// Polyfill for ES5's Function.bind.
	var bind = function(scope, func) {
		return function() {
			return func.apply(scope, arguments);
		};
	};

	// Super exciting object merger-matron 9000 adding another 100 bytes to your download.
	var merge = function () {
		var args = arguments, target = args[0], key, i;
		for (i = 1; i < args.length; i++) {
			for (key in args[i]) {
				if (!(key in target) && args[i].hasOwnProperty(key)) {
					target[key] = args[i][key];
				}
			}
		}
		return target;
	};

	// Helper to define a logging level object; helps with optimisation.
	var defineLogLevel = function(value, name) {
		return { value: value, name: name };
	};

	// Predefined logging levels.
	Logger.TRACE = defineLogLevel(1, 'TRACE');
	Logger.DEBUG = defineLogLevel(2, 'DEBUG');
	Logger.INFO = defineLogLevel(3, 'INFO');
	Logger.TIME = defineLogLevel(4, 'TIME');
	Logger.WARN = defineLogLevel(5, 'WARN');
	Logger.ERROR = defineLogLevel(8, 'ERROR');
	Logger.OFF = defineLogLevel(99, 'OFF');

	// Inner class which performs the bulk of the work; ContextualLogger instances can be configured independently
	// of each other.
	var ContextualLogger = function(defaultContext) {
		this.context = defaultContext;
		this.setLevel(defaultContext.filterLevel);
		this.log = this.info;  // Convenience alias.
	};

	ContextualLogger.prototype = {
		// Changes the current logging level for the logging instance.
		setLevel: function (newLevel) {
			// Ensure the supplied Level object looks valid.
			if (newLevel && "value" in newLevel) {
				this.context.filterLevel = newLevel;
			}
		},
		
		// Gets the current logging level for the logging instance
		getLevel: function () {
			return this.context.filterLevel;
		},

		// Is the logger configured to output messages at the supplied level?
		enabledFor: function (lvl) {
			var filterLevel = this.context.filterLevel;
			return lvl.value >= filterLevel.value;
		},

		trace: function () {
			this.invoke(Logger.TRACE, arguments);
		},

		debug: function () {
			this.invoke(Logger.DEBUG, arguments);
		},

		info: function () {
			this.invoke(Logger.INFO, arguments);
		},

		warn: function () {
			this.invoke(Logger.WARN, arguments);
		},

		error: function () {
			this.invoke(Logger.ERROR, arguments);
		},

		time: function (label) {
			if (typeof label === 'string' && label.length > 0) {
				this.invoke(Logger.TIME, [ label, 'start' ]);
			}
		},

		timeEnd: function (label) {
			if (typeof label === 'string' && label.length > 0) {
				this.invoke(Logger.TIME, [ label, 'end' ]);
			}
		},

		// Invokes the logger callback if it's not being filtered.
		invoke: function (level, msgArgs) {
			if (logHandler && this.enabledFor(level)) {
				logHandler(msgArgs, merge({ level: level }, this.context));
			}
		}
	};

	// Protected instance which all calls to the to level `Logger` module will be routed through.
	var globalLogger = new ContextualLogger({ filterLevel: Logger.OFF });

	// Configure the global Logger instance.
	(function() {
		// Shortcut for optimisers.
		var L = Logger;

		L.enabledFor = bind(globalLogger, globalLogger.enabledFor);
		L.trace = bind(globalLogger, globalLogger.trace);
		L.debug = bind(globalLogger, globalLogger.debug);
		L.time = bind(globalLogger, globalLogger.time);
		L.timeEnd = bind(globalLogger, globalLogger.timeEnd);
		L.info = bind(globalLogger, globalLogger.info);
		L.warn = bind(globalLogger, globalLogger.warn);
		L.error = bind(globalLogger, globalLogger.error);

		// Don't forget the convenience alias!
		L.log = L.info;
	}());

	// Set the global logging handler.  The supplied function should expect two arguments, the first being an arguments
	// object with the supplied log messages and the second being a context object which contains a hash of stateful
	// parameters which the logging function can consume.
	Logger.setHandler = function (func) {
		logHandler = func;
	};

	// Sets the global logging filter level which applies to *all* previously registered, and future Logger instances.
	// (note that named loggers (retrieved via `Logger.get`) can be configured independently if required).
	Logger.setLevel = function(level) {
		// Set the globalLogger's level.
		globalLogger.setLevel(level);

		// Apply this level to all registered contextual loggers.
		for (var key in contextualLoggersByNameMap) {
			if (contextualLoggersByNameMap.hasOwnProperty(key)) {
				contextualLoggersByNameMap[key].setLevel(level);
			}
		}
	};

	// Gets the global logging filter level
	Logger.getLevel = function() {
		return globalLogger.getLevel();
	};

	// Retrieve a ContextualLogger instance.  Note that named loggers automatically inherit the global logger's level,
	// default context and log handler.
	Logger.get = function (name) {
		// All logger instances are cached so they can be configured ahead of use.
		return contextualLoggersByNameMap[name] ||
			(contextualLoggersByNameMap[name] = new ContextualLogger(merge({ name: name }, globalLogger.context)));
	};

	// CreateDefaultHandler returns a handler function which can be passed to `Logger.setHandler()` which will
	// write to the window's console object (if present); the optional options object can be used to customise the
	// formatter used to format each log message.
	Logger.createDefaultHandler = function (options) {
		options = options || {};

		options.formatter = options.formatter || function defaultMessageFormatter(messages, context) {
			// Prepend the logger's name to the log message for easy identification.
			if (context.name) {
				messages.unshift("[" + context.name + "]");
			}
		};

		// Map of timestamps by timer labels used to track `#time` and `#timeEnd()` invocations in environments
		// that don't offer a native console method.
		var timerStartTimeByLabelMap = {};

		// Support for IE8+ (and other, slightly more sane environments)
		var invokeConsoleMethod = function (hdlr, messages) {
			Function.prototype.apply.call(hdlr, console, messages);
		};

		// Check for the presence of a logger.
		if (typeof console === "undefined") {
			return function () { /* no console */ };
		}

		return function(messages, context) {
			// Convert arguments object to Array.
			messages = Array.prototype.slice.call(messages);

			var hdlr = console.log;
			var timerLabel;

			if (context.level === Logger.TIME) {
				timerLabel = (context.name ? '[' + context.name + '] ' : '') + messages[0];

				if (messages[1] === 'start') {
					if (console.time) {
						console.time(timerLabel);
					}
					else {
						timerStartTimeByLabelMap[timerLabel] = new Date().getTime();
					}
				}
				else {
					if (console.timeEnd) {
						console.timeEnd(timerLabel);
					}
					else {
						invokeConsoleMethod(hdlr, [ timerLabel + ': ' +
							(new Date().getTime() - timerStartTimeByLabelMap[timerLabel]) + 'ms' ]);
					}
				}
			}
			else {
				// Delegate through to custom warn/error loggers if present on the console.
				if (context.level === Logger.WARN && console.warn) {
					hdlr = console.warn;
				} else if (context.level === Logger.ERROR && console.error) {
					hdlr = console.error;
				} else if (context.level === Logger.INFO && console.info) {
					hdlr = console.info;
				} else if (context.level === Logger.DEBUG && console.debug) {
					hdlr = console.debug;
				} else if (context.level === Logger.TRACE && console.trace) {
					hdlr = console.trace;
				}

				options.formatter(messages, context);
				invokeConsoleMethod(hdlr, messages);
			}
		};
	};

	// Configure and example a Default implementation which writes to the `window.console` (if present).  The
	// `options` hash can be used to configure the default logLevel and provide a custom message formatter.
	Logger.useDefaults = function(options) {
		Logger.setLevel(options && options.defaultLevel || Logger.DEBUG);
		Logger.setHandler(Logger.createDefaultHandler(options));
	};

	// Export to popular environments boilerplate.
	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (Logger),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	else {}
}(this));


/***/ })

/******/ });
//# sourceMappingURL=main.bundle.js.map
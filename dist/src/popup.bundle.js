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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/popup.ts");
/******/ })
/************************************************************************/
/******/ ({

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

/***/ "./src/popup.ts":
/*!**********************!*\
  !*** ./src/popup.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DBData_1 = __webpack_require__(/*! ./interface/DBData */ "./src/interface/DBData.ts");
const logger_1 = __importDefault(__webpack_require__(/*! ./utils/logger */ "./src/utils/logger.js"));
function isValidRegExp(string) {
    try {
        new RegExp(string);
    }
    catch (_a) {
        return false;
    }
    return true;
}
class BodyGUI {
    showMessage(message) {
        $(".hide.message")
            .clone().appendTo("body").removeClass("hide").css("display", "hide")
            .html(message)
            .fadeIn().delay(2000).fadeOut(function () {
            $(this).remove();
        });
    }
    _resetNumbering() {
        $(".filterItem").not(".hide").each((i, self) => {
            $(self).find(".titleWrap > span").html("#" + i);
        });
    }
    /**
     * 새로운 노드 추가
     */
    addNode() {
        const $target = $(".filterItem.hide")
            .clone()
            .prependTo("#filterList")
            .removeClass("hide")
            .css("display", "none")
            .fadeIn();
        $target.find(".card-image img")
            .attr("src", `imgs/${Math.floor(Math.random() * 14)}.jpg`);
        this._resetNumbering();
        this._bindNodeEvent($target);
        return $target;
    }
    /**
     * 노드에 이벤트 구속
     * @param target 이벤트를 바인딩할 노드의 htmlelement
     */
    _bindNodeEvent($target) {
        const self = this;
        //노드 삭제 버튼 클릭시 노드 삭제되는 이벤트 바인딩
        $target.find(".removeNode").click(function () {
            self.removeNode($(this).closest(".filterItem"));
        });
        //사용자를 차단하려고 했을때 상세 차단정보가 나타나게 함
        $target.find(".isBlock").click(function () {
            $(this).closest(".behaiveWrap")
                .find(".blockDetailWrap")
                .fadeToggle();
        });
        // materialize select 이벤트 정의
        $target.find('.length').formSelect();
        //새로운 조건 추가
        self.addCondition($target);
    }
    /**
     * 기존의 노드 삭제
     * @param $node 삭제할 노드의 jquery element
     */
    removeNode($node) {
        $node.slideUp({
            complete: function () {
                $(this).remove();
            },
        });
        this._resetNumbering();
    }
    //모든 노드 삭제
    removeAllNode() {
        $(".filterItem").not(".hide").remove();
    }
    //새로운 조건 추가
    addCondition($node) {
        const $list = $node.find(".conditionList");
        const $clonedTarget = $("#forClone.hide .condition")
            .clone();
        $clonedTarget
            .appendTo($list)
            .hide()
            .slideDown(100);
        this._bindConditionEvent($clonedTarget, $node);
        return $clonedTarget;
    }
    /**
     * 차단조건 element가 새롭게 생성될때 차단조건에 이벤트 바인딩
     * @param $target 이벤트를 정의할 차단조건 요소
     * @param $node 차단조건 요소의 부모노드
     */
    _bindConditionEvent($target, $node) {
        const self = this;
        // 마테리얼라이즈 셀렉트 이벤트 정의
        $target.find('select').formSelect();
        // 입력한 검열단어가 맨 마지막일 경우 필터 추가
        $target.find(".test").keyup(function () {
            const $inputbox = $(this);
            const selfIndex = $(this).closest(".condition").index() + 1;
            const condtionLength = $(this).closest(".conditionList").find(".condition").length;
            const isLastCondition = selfIndex === condtionLength;
            if ($inputbox.val() !== "" && isLastCondition)
                self.addCondition($node);
        });
        // 마지막이 아닌 검열단어에 입력이 없을경우 필터 삭제
        $target.find(".test").blur(function () {
            const $inputbox = $(this);
            const $condition = $(this).closest(".condition");
            const selfIndex = $condition.index() + 1;
            const condtionLength = $(this).closest(".conditionList").find(".condition").length;
            const isLastCondition = selfIndex === condtionLength;
            if ($inputbox.val() == "" && !isLastCondition)
                self.removeCondition($condition);
        });
        // 검열형태가 정규식일때 검열단어가 올바른 정규식이 아닌 경우 툴팁 출력
        $target.find(".test").blur(function () {
            const $input = $(this);
            const inputval = $input.val();
            const $type = $(this).closest(".condition").find(".type");
            let tooltipInstance = M.Tooltip.getInstance($input[0]);
            let isValid = isValidRegExp(inputval);
            // 남아있는 tooltip intance 삭제
            if (tooltipInstance !== undefined) {
                tooltipInstance.destroy();
                $input.removeClass("invalid");
            }
            if ($type.val() == DBData_1.DBDATA_CONDITIONTYPE.REGEX && !isValid) {
                tooltipInstance = M.Tooltip.init($input, {
                    position: "top",
                    html: "올바르지 않은 정규식입니다."
                })[0];
                $input.addClass("invalid");
                tooltipInstance.open();
            }
        });
    }
    //기존의 조건 삭제
    removeCondition($condition) {
        $condition.slideUp({
            complete: function () {
                $(this).remove();
            },
        });
    }
    setNodes(dbs) {
        this.removeAllNode();
        dbs.forEach(db => {
            if (db.condition.length === 0)
                return;
            const $target = this.addNode();
            this._setNode($target, db);
        });
    }
    //db데이터로 노드 갱신
    _setNode($target, db) {
        $target.find(".condition").remove();
        if (db.isRemove)
            $target.find(".isRemove").trigger("click");
        if (db.block.isBlock)
            $target.find(".isBlock").trigger("click");
        $target.find(".length").val(db.block.length).formSelect();
        $target.find(".reason").val(db.block.reason);
        db.condition.forEach((option) => {
            const $condiction = this.addCondition($target);
            $condiction.find(".target").val(option.target).formSelect();
            $condiction.find(".test").val(option.test);
            $condiction.find(".type").val(option.type).formSelect();
        });
    }
    toJSON() {
        return $(".filterItem")
            .not(".hide")
            .toArray()
            .map(node => {
            return this.nodeToJson($(node));
        })
            .filter(node => {
            return node.condition.length !== 0;
        });
    }
    nodeToJson($node) {
        const $target = $node;
        const conditions = $node
            .find(".condition")
            .not(".hide")
            .toArray()
            .map(condition => {
            const $condition = $(condition);
            return this._conditionToJson($condition);
        })
            //검열단어가 비어있는 조건 필터링
            .filter(condition => condition.test !== "");
        return {
            condition: conditions,
            isRemove: $node.find(".isRemove").is(":checked"),
            block: {
                isBlock: $node.find(".isBlock").is(":checked"),
                length: $node.find(".length").val(),
                reason: $node.find(".reason").val()
            }
        };
    }
    _conditionToJson($condition) {
        return {
            target: parseInt($condition.find(".target").val()),
            test: $condition.find(".test").val(),
            type: parseInt($condition.find(".type").val()),
        };
    }
}
const bodyGUI = new BodyGUI();
class OtherGUI {
    constructor() {
        this.$refreshInterval = $("#refreshInterval");
        this.$removeLimitCount = $("#removeLimitCount");
        this._initEventListener();
    }
    printExportData(dbData) {
        const textData = JSON.stringify(dbData);
        $("#exportData").html(textData);
    }
    /**
     * 이벤트 정의
     */
    _initEventListener() {
        const { $refreshInterval, $removeLimitCount } = this;
        /**
         * 자동 새로고침의 여부, 간격 설정
         * #refreshInterval .value에 저장됨
         */
        $refreshInterval
            .on("input", function () {
            const $this = $(this);
            const id = this.id;
            let value = parseInt($(this).val()) / 100;
            const message = value === 0 ?
                "자동 새로고침 해제" :
                `자동 새로고침 간격 <span class="value">${value}</span>초`;
            $(`#${id}Descript`).html(message);
        });
        /**
         * 최대 삭제갯수 제한 설정
         * #refreshInterval .value에 저장됨
         */
        $removeLimitCount
            .on("input", function () {
            const $this = $(this);
            const id = this.id;
            let value = parseInt($(this).val());
            const message = value === 0 ?
                '삭제 갯수 제한 해제' :
                `1회 최대 삭제 갯수 <span class="value">${value}</span>개`;
            $(`#${id}Descript`).html(message);
        });
        $([$refreshInterval, $removeLimitCount])
            .val(0)
            .trigger("input");
        /**
         * materiallize에서 제공되는 기본 이벤트 정의
         */
        //사이드 네비게이션
        $("#sideNav").sidenav();
        $('.collapsible').collapsible();
    }
    getSettingJSON() {
        let autoRefresh = undefined;
        let removeLimit = undefined;
        if ($("#refreshIntervalDescript .value").length !== 0)
            autoRefresh = $("#refreshInterval").val();
        if ($("#removeLimitCount .value").length !== 0)
            removeLimit = $("#refreshInterval").val();
        return {
            autoRefresh,
            removeLimit
        };
    }
    setSetting(setting) {
        let { autoRefresh, removeLimit } = setting;
        const { $refreshInterval, $removeLimitCount } = this;
        autoRefresh = autoRefresh || 0;
        removeLimit = removeLimit || 0;
        $refreshInterval.val(autoRefresh).trigger("input");
        $removeLimitCount.val(removeLimit).trigger("input");
    }
}
class ChromeStorageBridge {
    set(dbData, galleryID, callback = () => { }) {
        const debugID = "id : " + Math.floor(Math.random() * 50000);
        logger.debug("데이터 저장 시도", debugID, dbData, galleryID);
        chrome.storage.sync.set({ ["Swiper_" + galleryID]: dbData }, () => {
            logger.debug("데이터 저장 성공", debugID);
            callback();
        });
    }
    load(galleryID, callback) {
    }
}
const chromeStorageBridge = new ChromeStorageBridge();
const otherGUI = new OtherGUI();
const logger = logger_1.default;
logger.useDefaults({
    defaultLevel: logger_1.default.DEBUG,
    formatter: function (messages, context) {
        messages.unshift(new Date().toUTCString());
    }
});
function getDefaultData() {
    return {
        dbs: [],
        setting: {
            autoRefresh: undefined,
            removeLimit: 10
        },
        version: 0.5
    };
}
let isEnableSave = true;
function saveData() {
    // loadData 함수 실행중일경우 종료
    if (!isEnableSave)
        return;
    const dbData = {
        dbs: bodyGUI.toJSON(),
        setting: otherGUI.getSettingJSON(),
        version: 0.5
    };
    otherGUI.printExportData(dbData);
    const galleryID = $("#search").val();
    chromeStorageBridge.set(dbData, galleryID);
}
// 노드 추가
$("#addNode").click(bodyGUI.addNode.bind(bodyGUI));
// 검색기능
$("#search").keyup((e) => {
    isEnableSave = false;
    var galleryID = "Swiper_" + $("#search").val();
    chrome.storage.sync.get(galleryID, function (result) {
        let dbData = result[galleryID];
        if (dbData == undefined)
            dbData = getDefaultData();
        bodyGUI.setNodes(dbData.dbs);
        otherGUI.setSetting(dbData.setting);
        isEnableSave = true;
    });
});
//세부요소 삭제시 자동 세이브 기능 탑재
$("#wrap").on("DOMNodeRemoved", (fn) => {
    // 검색중인경우 자동세이브 무효화
    if ($("#search").is(':focus'))
        return;
    const classList = fn.target.classList;
    if (classList.contains("filterItem") || classList.contains("condition")) {
        logger.debug("DOMNodeRemoved 이벤트 발생, 데이터 저장 시도", fn);
        saveData();
    }
});
//노드 추가시 자동 세이브 기능 탑재
$("#wrap").on("change input", function (fn) {
    logger.debug("change input 이벤트 발생, 데이터 저장 시도", fn);
    saveData();
});
$("#sideNav").on("mouseup", function (fn) {
    logger.debug("sidenav click 이벤트 발생, 데이터 저장 시도", fn);
    saveData();
});


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
//# sourceMappingURL=popup.bundle.js.map
import { DBData } from './interface/DBData'
import DCBoard from './model/DCBoard'
import DBDataModel from './model/DBDataModel';
import CleanerGUI from './controller/cleanerGUI';
import Cleaner from './controller/cleaner';
import Logger from './utils/logger';


const logger = Logger
logger.useDefaults({
    defaultLevel: Logger.DEBUG,
    formatter: function (messages, context) {
        messages.unshift(new Date().toUTCString())
    }
})

function onGalleryLoad() {
    const dataModel = new DBDataModel();

    dataModel.loadData()
        .then((datas: DBData) => {

            const dcBoard = new DCBoard();
            const gui = new CleanerGUI(datas,logger);
            const cleaner = new Cleaner(dcBoard, datas, gui, logger);
            const result = cleaner.start()
            gui.doAlert(result); 

            //재시작
            if(datas.setting.autoRefresh !== undefined)
                setTimeout( () => {
                    location = location
                },datas.setting.autoRefresh * 10)
        })
}



onGalleryLoad();

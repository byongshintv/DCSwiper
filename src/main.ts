import { DBData } from './interface/DBData'
import DCBoard from './model/DCBoard'
import CleanerGUI from './controller/cleanerGUI';
import Cleaner from './controller/cleaner';
import Logger from './utils/logger';
import ChromeStorageBridge from './model/ChromeCtoargeBridge';


const logger = Logger
logger.useDefaults({
    defaultLevel: Logger.DEBUG,
    formatter: function (messages, context) {
        messages.unshift(new Date().toUTCString())
    }
})

function onGalleryLoad() {
    function callback(datas: DBData){

        const dcBoard = new DCBoard();
        const gui = new CleanerGUI(datas,logger);
        const cleaner = new Cleaner(dcBoard, datas, gui, logger);
        const result = cleaner.start()
        gui.doAlert(result); 

        const autoRefresh = datas.setting.autoRefresh
        //재시작
        if( autoRefresh !== null)
            setTimeout( () => {
                location = location
            },autoRefresh * 10)
    }

    const galleryID:string = new URL(location.href).searchParams.get("id") as string
    new ChromeStorageBridge().load(galleryID,callback)

}



onGalleryLoad();

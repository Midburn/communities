import i18n from './i18n';

export class CampsService {

    getPropertyByLang(camp, propName) {
        if (!camp || !propName) {
            return '';
        }
        const {lng} = i18n.language;
        const isHeb = lng === 'he';
        switch (propName) {
            case 'name':
                propName = isHeb ? 'camp_name_he' : 'camp_name_en';
                break;
            case 'description':
                propName = isHeb ? 'camp_desc_he' : 'camp_desc_en';
                break;
            default:
                break;
        }
        if (!camp.hasOwnProperty(propName)) {
            console.warn(`Property ${propName} doesn't exist in Camp! maybe the model changed?`);
            return '';
        }
        return camp[propName];
    }

    sendJoinRequest(camp) {
        return new Promise(resolve => {
            setTimeout(resolve, 10000);
        });
    }
}

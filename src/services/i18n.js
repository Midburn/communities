import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import detector from 'i18next-browser-languagedetector';
import backend from 'i18next-xhr-backend';


i18n.use(detector)
    .use(backend)
    .use(reactI18nextModule) // passes i18n down to react-i18next
    .init({
        ns: ['common', 'camps'],
        defaultNS: 'common',
        react: {
            wait: true,
            withRef: false,
            bindI18n: 'languageChanged loaded',
            bindStore: 'added removed',
            nsMode: 'default'
        },
        lng: 'he',
        fallbackLng: "en", // use en if detected lng is not available
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
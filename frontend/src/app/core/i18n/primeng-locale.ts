import { Translation } from 'primeng/api';
import type { AppLang } from '../services/language';

/**
 * PrimeNG ships English defaults only. These objects localize built-in component texts
 * (DatePicker month/day names, Password strength, ConfirmDialog buttons, etc.).
 * Applied by LanguageService via PrimeNG.setTranslation() on every language change.
 */
const EN: Translation = {
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  firstDayOfWeek: 0,
  today: 'Today',
  clear: 'Clear',
  weekHeader: 'Wk',
  weak: 'Weak',
  medium: 'Medium',
  strong: 'Strong',
  passwordPrompt: 'Enter a password',
  accept: 'Yes',
  reject: 'No',
  cancel: 'Cancel',
  apply: 'Apply',
  emptyMessage: 'No results found',
  emptyFilterMessage: 'No results found',
  chooseYear: 'Choose Year',
  chooseMonth: 'Choose Month',
  chooseDate: 'Choose Date',
  prevDecade: 'Previous Decade',
  nextDecade: 'Next Decade',
  prevYear: 'Previous Year',
  nextYear: 'Next Year',
  prevMonth: 'Previous Month',
  nextMonth: 'Next Month'
};

const ES: Translation = {
  dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  firstDayOfWeek: 1,
  today: 'Hoy',
  clear: 'Limpiar',
  weekHeader: 'Sm',
  weak: 'Débil',
  medium: 'Media',
  strong: 'Fuerte',
  passwordPrompt: 'Ingresa una contraseña',
  accept: 'Sí',
  reject: 'No',
  cancel: 'Cancelar',
  apply: 'Aplicar',
  emptyMessage: 'No se encontraron resultados',
  emptyFilterMessage: 'No se encontraron resultados',
  chooseYear: 'Elegir año',
  chooseMonth: 'Elegir mes',
  chooseDate: 'Elegir fecha',
  prevDecade: 'Década anterior',
  nextDecade: 'Década siguiente',
  prevYear: 'Año anterior',
  nextYear: 'Año siguiente',
  prevMonth: 'Mes anterior',
  nextMonth: 'Mes siguiente'
};

export const PRIMENG_TRANSLATIONS: Record<AppLang, Translation> = { en: EN, es: ES };

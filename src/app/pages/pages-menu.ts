import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Start',
    icon: 'home-outline',
    link: '/pages/iot-dashboard',
    home: true,
  },
  {
    title: 'Wyzwanie',
    icon: 'droplet-outline',
    link: '/pages/wyzwanie',
  },
  {
    title: 'Statystyki',
    icon: 'bar-chart-outline',
    link: '/pages/dashboard',
  },
  {
    title: 'Mój dom',
    icon: 'settings-2-outline',
    link: '/pages/settings',
  },
  {
    title: 'Analiza zużycia',
    icon: 'shake-outline',
    link: '/pages/innovations',
  },
];

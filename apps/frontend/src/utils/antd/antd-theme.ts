import { ThemeConfig } from 'antd/es/config-provider/context';

const styles = getComputedStyle(document.documentElement);

export default {
  token: {
    colorPrimary: styles.getPropertyValue('--color-primary'),
  },
} satisfies ThemeConfig;

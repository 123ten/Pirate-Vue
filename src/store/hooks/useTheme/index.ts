/**
 * @name 'useTheme'
 */
import {defineStore} from "pinia";
import {reactive, ref} from "vue";
import {MappingAlgorithm, ThemeConfig} from "ant-design-vue/es/config-provider/context";
import {theme as defaultTheme} from 'ant-design-vue';

const {useToken} = defaultTheme
export const useTheme = defineStore(
  'theme',
  () => {
    const theme = reactive<ThemeConfig>({
      algorithm: defaultTheme.defaultAlgorithm,
    })
    // 是否暗黑主题
    const isDartTheme = ref<boolean>(false);

    const setAlgorithm = (algorithm: keyof typeof defaultTheme) => {
      theme.algorithm = defaultTheme[algorithm] as MappingAlgorithm | MappingAlgorithm[];
      theme.token = {
        colorPrimary: '#00b96b',
      }
      isDartTheme.value = algorithm === 'darkAlgorithm'
    }

    return {
      theme,
      isDartTheme,
      setAlgorithm,
      useToken,
    }
  }
);

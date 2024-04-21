import { onMounted, reactive } from "vue";
import { calculateNextPage, formatDateRange } from "@/utils/common";
import { Form, notification } from "ant-design-vue";
import i18n from "@/locales";
import type { IPages } from "@/types";
import {
  CustomParamsKey,
  DefaultFieldsType,
  FormReactive,
  FormRefs,
  Operation,
  PrivateApi,
  TableReactive,
  TableSettingsType,
} from "@/types/tableSettingsType";
import type { Key } from "ant-design-vue/lib/table/interface";
import type { DefaultRecordType } from "ant-design-vue/es/vc-table/interface";
import { isArray } from "lodash-es";
import dayjs from "dayjs";
import { DateRangeTuple, Rules } from "@/types/form";

const { t } = i18n.global;

export const tableSettingKey = Symbol("tableSettings");

export default class TableSettings<
  RecordType = DefaultRecordType,
  QueryForm = DefaultRecordType,
  Fields extends DefaultFieldsType = DefaultFieldsType
> implements TableSettingsType<RecordType, QueryForm, Fields>
{
  private api: PrivateApi;

  public readonly table = reactive<TableReactive<RecordType, QueryForm>>({
    columns: [],
    dataSource: [],
    selectedRowKeys: [],
    operations: [],
    pages: {
      page: 1,
      size: 10,
      total: 0,
    },
    pagination: {
      // 可能是这边的问题 要是有分页问题吧
      pageSize: 10,
      current: 1,
      total: 0,
    },
    queryForm: {} as QueryForm,
    i18nPrefix: undefined,
    rowKey: "id",
    remark: undefined,
    loading: false,
    defaultExpandAllRows: false,
  });

  public readonly form = reactive<FormReactive<Fields>>({
    fields: {} as Fields,
    rules: undefined,
    visible: false,
    loading: false,
  });

  public formRefs?: FormRefs;

  public customParams?: TableSettingsType["customParams"];

  constructor(options: any) {
    const { api, table, form, customParams } = options;

    this.api = api;
    this.customParams = customParams;
    Object.assign(this.table, table);
    Object.assign(this.form, form);

    this.initFormRefs();
    this.mounted();
  }

  /** 表格初始化 */
  public mounted = () => {
    onMounted(async () => {
      await Promise.all([this.queryAll()]);
    });
  };

  /**
   * 给formRefs赋值
   * @param isEditing {boolean} 是否编辑
   */
  private initFormRefs = (isEditing?: boolean) => {
    this.formRefs = Form.useForm(
      this.form.fields,
      this.transformRules(this.form.rules, isEditing)
    );
  };

  private getParams(key: CustomParamsKey, params: Record<string, any>) {
    return this.customParams?.[key]?.(params) || params;
  }

  // region API请求方法
  public queryAll = async () => {
    const pages = this.table.pagination
      ? {
          page: calculateNextPage(this.table.pages),
          size: this.table.pages.size,
        }
      : undefined;
    const query = {
      ...pages,
      ...this.transformParams(),
    };
    const params = this.getParams("queryAll", query);
    this.table.loading = true;
    try {
      const { data } = await this.api?.request(params);
      console.log("queryAll -->", data);
      this.table.remark = data.remark;
      this.table.dataSource = data.records;

      this.table.pages = {
        size: data.size,
        page: data.page,
        total: data.total,
      };
    } finally {
      this.table.loading = false;
    }
  };

  public deleteByIds = async (
    type: Extract<Operation, "delete" | "row-delete">,
    ids: Key[]
  ) => {
    await this.api?.deleteRequest(ids);
    notification.success({
      message: t("message.success"),
      description: t("success.delete"),
    });
    if (type === "delete") {
      this.table.selectedRowKeys = [];
    }
    // 用于计算最大页数
    this.table.pages.total -= ids.length;
    await this.queryAll();
  };

  public detailById = async (id: Key, success?: Function) => {
    this.form.loading = true;
    try {
      const { data } = await this.api?.detailRequest(id);
      success?.(data);
      Object.assign(this.form.fields, data);
    } finally {
      this.form.loading = false;
    }
  };
  // endregion

  public selectChange = (selectedRowKeys: Key[]) => {
    this.table.selectedRowKeys = selectedRowKeys;
  };

  public pagesChange = async (pages: IPages) => {
    this.table.pages = pages;
    await this.queryAll();
  };

  public openForm = async (type: 0 | 1, id?: Key, success?: Function) => {
    this.form.visible = true;
    const isEditing = type === 1; // 是否编辑
    // 当 rules 的类型为 function 默认认为需要动态修改校验
    if (typeof this.form.rules === "function") {
      this.initFormRefs(isEditing);
    }
    if (isEditing && id) {
      await this.detailById(id, success);
    }
  };

  public cancelForm = () => {
    this.form.visible = false;
    this.formRefs?.resetFields();
  };

  public confirmForm = async () => {
    await this.formRefs?.validate();
    const { fields } = this.form;
    const params = this.getParams("confirmForm", fields);
    console.log("confirmForm --> params", params);
    this.form.loading = true;
    try {
      await this.api.upsertRequest(params);
      notification.success({
        message: t("message.success"),
        description: t(fields.id ? "success.update" : "success.create"),
      });
      this.cancelForm();
      await this.queryAll();
    } finally {
      this.form.loading = false;
    }
  };

  public openDetail = async (id: Key, success?: Function) => {
    this.form.visible = true;
    await this.detailById(id, success);
  };

  /**
   * 转换列表查询参数
   */
  public transformParams = () => {
    const queryParams = this.table.queryForm;
    if (!queryParams) return;
    const params = {} as QueryForm;
    Object.keys(queryParams).forEach((key) => {
      const param = queryParams[key];
      if (isArray(param)) {
        const isDayjs = param.every((item) => item instanceof dayjs);
        if (isDayjs) {
          // range-picker 的数据
          params[key] = formatDateRange(param as DateRangeTuple);
        } else {
          params[key] = param;
        }
      } else {
        params[key] = param;
      }
    });
    return params;
  };

  /**
   * 转换rules校验
   * @param rules 校验规则
   * @param isEditing {boolean} 是否编辑 默认 非编辑
   */
  private transformRules = (
    rules?: Rules | ((isEditing: boolean, fields: Fields) => Rules),
    isEditing: boolean = false
  ) => {
    if (typeof rules === "function") {
      return rules(isEditing, this.form.fields as Fields);
    }
    return rules;
  };
}

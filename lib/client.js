window.__ModuleLoader__.load({
  id: "dsh-rabbit-model-picker",
  factory: (require) => {
    var module = { exports: {} }; var exports = module.exports;
    "use strict";
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
    
    // src/client/index.ts
    var index_exports = {};
    __export(index_exports, {
      apply: () => apply,
      inject: () => inject
    });
    module.exports = __toCommonJS(index_exports);
    
    // src/client/dictionary.ts
    var NS = "dsh-rabbit-model-picker";
    var zh = {
      "provider.account": "DeepSeek 账号",
      "provider.all": "全部",
      "provider.chipAria": "模型提供商，当前 {name}",
      "provider.sessionHere": "当前会话",
      "provider.group": "模型提供商",
      "provider.menuAria": "选择模型提供商",
      "provider.search": "搜索提供商…",
      "provider.filtered": "仅显示 {name}",
      "provider.filteredRecent": "仅显示最近使用的模型",
      "provider.showAll": "显示全部",
      "provider.failed": "加载失败",
      "empty.provider": "该提供商没有可用模型。",
      "empty.recent": "没有可显示的最近使用模型。",
      "trigger.fallback": "请选择模型",
      "trigger.loading": "正在加载模型…",
      "trigger.selectAria": "请选择模型",
      "trigger.aria": "选择模型，当前 {model}",
      "trigger.ariaEffort": "选择模型，当前 {model}，推理等级 {effort}",
      "menu.aria": "模型与推理等级",
      "menu.model": "模型",
      "search.placeholder": "搜索模型…",
      "search.clear": "清除搜索",
      "group.recent": "最近使用",
      "effort.providerDefault": "Default",
      "badge.text.on": "文字输入",
      "badge.text.off": "不支持文字输入",
      "badge.image.on": "图片输入",
      "badge.image.off": "不支持图片输入",
      "badge.effort": "思考强度 {level}",
      "badge.effort.none": "未声明思考档位",
      "badge.context": "上下文窗口 {value}",
      "badge.rowAria": "{model}，{facts}",
      "status.loading": "正在刷新模型列表…",
      "error.action": "模型操作失败：{message}",
      "error.sessionInUse": "当前会话已被占用，可能是其他正在运行的 DSH 导致的（如其他 dsh web、桌面端），请退出其他正在运行的 DSH 后重试。",
      "action.reload": "重新加载",
      "warning.groupLoad": "{name} 加载失败：{message}",
      "search.empty": "没有匹配的模型。",
      "empty.models": "没有可用的模型。",
      "settings.open": "模型参数",
      "settings.openDeclared": "已自定义",
      "settings.openNoModel": "先选择模型，再编辑它的参数",
      "settings.openAria": "编辑 {model} 的模型参数",
      "settings.aria": "{model} 的模型参数",
      "settings.reset": "恢复默认",
      "settings.resetAria": "把 {model} 的参数恢复为适配器默认",
      "settings.resetNothing": "这条模型声明里没有可恢复的改动",
      "settings.listJoin": "、",
      "settings.loading": "正在读取当前参数…",
      "settings.busy": "正在应用这次选择，参数暂时不能改…",
      "settings.unavailable": "这个部署没有挂载设置服务，参数面板只能查看（思考强度仍可用）。",
      "settings.loadFailed": "读不到当前设置：{message}",
      "settings.unaddressable": "这个模型来自适配器内置目录，没有可编辑的声明，只能查看。",
      "settings.readonly": "当前配置不接受表单修改，参数面板只能查看。",
      "settings.writeFailed": "设置服务拒绝了这次修改：{message}",
      "settings.target": "写入位置：{ns} · {path}",
      "settings.input.title": "输入类型",
      "settings.input.text": "文字",
      "settings.input.image": "图片",
      "settings.input.declared": "已声明：{list}",
      "settings.input.default": "尚未声明，当前按适配器默认：{list}",
      "settings.input.defaultUnknown": "尚未声明，也没有适配器默认；实际输入类型由适配器内部决定。",
      "settings.input.needOne": "至少要保留一项输入类型；要回到默认请用「恢复默认」。",
      "settings.context.title": "上下文窗口",
      "settings.context.declared": "已声明；留空并回车 = 恢复适配器默认",
      "settings.context.default": "尚未声明；适配器声明的兜底值是 {value}，实际容量由它内部决定",
      "settings.context.unset": "尚未声明，也没有兜底值；只有这里填了才会覆盖适配器内部的值。",
      "settings.context.invalid": "读不出这个数值：请写 128K、1M 或 131072，范围 1024–10485760",
      "settings.effort.title": "思考强度",
      "settings.note": "输入类型与上下文窗口会直接写进适配器对这个模型的声明，立即生效，与「设置 → 模型」页改的是同一处；思考强度是会话级设置，不写进声明。"
    };
    var en = {
      "provider.account": "DeepSeek Account",
      "provider.all": "All",
      "provider.chipAria": "Model provider, current {name}",
      "provider.sessionHere": "this session",
      "provider.group": "Model providers",
      "provider.menuAria": "Choose a model provider",
      "provider.search": "Search providers…",
      "provider.filtered": "Showing {name} only",
      "provider.filteredRecent": "Showing recently used models only",
      "provider.showAll": "Show all",
      "provider.failed": "Failed to load",
      "empty.provider": "This provider has no available models.",
      "empty.recent": "No recently used models to show.",
      "trigger.fallback": "Select model",
      "trigger.loading": "Loading models…",
      "trigger.selectAria": "Select model",
      "trigger.aria": "Select model, current {model}",
      "trigger.ariaEffort": "Select model, current {model}, reasoning effort {effort}",
      "menu.aria": "Model and reasoning effort",
      "menu.model": "Model",
      "search.placeholder": "Search models…",
      "search.clear": "Clear search",
      "group.recent": "Recent",
      "effort.providerDefault": "Default",
      "badge.text.on": "Text input",
      "badge.text.off": "No text input",
      "badge.image.on": "Image input",
      "badge.image.off": "No image input",
      "badge.effort": "Reasoning effort {level}",
      "badge.effort.none": "No declared reasoning levels",
      "badge.context": "Context window {value}",
      "badge.rowAria": "{model}: {facts}",
      "status.loading": "Refreshing model list…",
      "error.action": "Model operation failed: {message}",
      "error.sessionInUse": "This session is already in use, possibly by another running DSH instance (such as dsh web or the desktop app). Quit other running DSH instances and try again.",
      "action.reload": "Reload",
      "warning.groupLoad": "{name} failed to load: {message}",
      "search.empty": "No matching models.",
      "empty.models": "No models available.",
      "settings.open": "Model parameters",
      "settings.openDeclared": "customized",
      "settings.openNoModel": "Select a model first, then edit its parameters",
      "settings.openAria": "Edit parameters of {model}",
      "settings.aria": "Model parameters for {model}",
      "settings.reset": "Restore defaults",
      "settings.resetAria": "Restore the adapter defaults for {model}",
      "settings.resetNothing": "This model has no declared change to restore",
      "settings.listJoin": ", ",
      "settings.loading": "Reading the current parameters…",
      "settings.busy": "Applying this selection; the parameters cannot be changed for a moment…",
      "settings.unavailable": "This deployment mounts no settings service, so the panel is view-only (reasoning effort still works).",
      "settings.loadFailed": "Cannot read the current settings: {message}",
      "settings.unaddressable": "This model comes from the adapter’s installed catalog and has no declaration to edit, so it is view-only.",
      "settings.readonly": "This configuration does not accept changes; the parameters are view-only.",
      "settings.writeFailed": "The settings service refused this change: {message}",
      "settings.target": "Written to: {ns} · {path}",
      "settings.input.title": "Input types",
      "settings.input.text": "Text",
      "settings.input.image": "Image",
      "settings.input.declared": "Declared: {list}",
      "settings.input.default": "Not declared yet; the adapter default is: {list}",
      "settings.input.defaultUnknown": "Not declared, and the adapter states no default; the adapter decides which input types it serves.",
      "settings.input.needOne": "Keep at least one input type; use “Restore defaults” to go back to the default.",
      "settings.context.title": "Context window",
      "settings.context.declared": "Declared; clear it and press Enter to fall back to the adapter default",
      "settings.context.default": "Not declared; the adapter states a fallback of {value}, but the capacity it actually uses is its own decision",
      "settings.context.unset": "Not declared, and there is no fallback; only a value here overrides whatever the adapter uses internally.",
      "settings.context.invalid": "That is not a capacity: use 128K, 1M or 131072, between 1024 and 10485760",
      "settings.effort.title": "Reasoning effort",
      "settings.note": "Input types and the context window are written straight into the adapter’s declaration for this model and take effect immediately — the same place Settings → Models edits. The reasoning effort is a session setting and is not written into the declaration."
    };
    function interpolate(template, params) {
      if (params === void 0) return template;
      return template.replace(/\{(\w+)\}/g, (match, name) => params[name] ?? match);
    }
    function localTranslate() {
      const language = typeof document === "undefined" ? "" : document.documentElement.lang;
      const dictionary = language.toLowerCase().startsWith("zh") ? zh : en;
      return (key, params) => interpolate(dictionary[key] ?? en[key] ?? key, params);
    }
    var dictionaries = { zh, en };
    
    // src/client/params.ts
    var MIN_CONTEXT = 1024;
    var MAX_CONTEXT = 10485760;
    var CONTEXT_PLACEHOLDER = "128K";
    var PANEL_MODALITIES = ["text", "image"];
    var INPUT_FIELD_BY_NS = {
      "llm-pi-ai": "input",
      "llm-deepseek": "inputModalities"
    };
    var INPUT_FIELD_CANDIDATES = ["input", "inputModalities"];
    var INITIAL_SNAPSHOT = {
      status: "idle",
      error: null,
      writable: false,
      providers: [],
      namespaces: {}
    };
    function parseContext(raw) {
      const text = raw.trim().replace(/[\s_]/g, "").toUpperCase();
      const match = /^(\d+(?:\.\d+)?)([KM])?$/.exec(text);
      if (match === null) return null;
      const scale = match[2] === "M" ? 1e6 : match[2] === "K" ? 1e3 : 1;
      const tokens = Math.round(Number(match[1]) * scale);
      if (!Number.isFinite(tokens) || tokens < MIN_CONTEXT || tokens > MAX_CONTEXT) return null;
      return tokens;
    }
    function formatContext(tokens) {
      if (tokens >= 1e6 && tokens % 1e5 === 0) return `${tokens / 1e6}M`;
      if (tokens >= 1e3 && tokens % 1e3 === 0) return `${tokens / 1e3}K`;
      return String(tokens);
    }
    function isRecord(value) {
      return typeof value === "object" && value !== null && !Array.isArray(value);
    }
    function getPath(value, path) {
      let node = value;
      for (const key of path) {
        if (Array.isArray(node)) {
          if (!/^\d+$/.test(key)) return void 0;
          node = node[Number(key)];
          continue;
        }
        if (!isRecord(node)) return void 0;
        node = node[key];
      }
      return node;
    }
    function stringList(value) {
      return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
    }
    function numberOrUndefined(value) {
      return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : void 0;
    }
    function inputFieldOf(entry, ns) {
      for (const candidate of INPUT_FIELD_CANDIDATES) {
        if (entry[candidate] !== void 0) return candidate;
      }
      return INPUT_FIELD_BY_NS[ns] ?? INPUT_FIELD_CANDIDATES[0];
    }
    function entryPathOf(value, scope, model) {
      const models = getPath(value, [...scope, "models"]);
      if (Array.isArray(models)) {
        const index = models.findIndex((entry) => isRecord(entry) && entry.id === model);
        if (index >= 0) return [...scope, "models", String(index)];
      }
      const overrides = getPath(value, [...scope, "modelOverrides"]);
      if (isRecord(overrides) && isRecord(overrides[model])) return [...scope, "modelOverrides", model];
      return null;
    }
    function resolveRoute(snapshot, route) {
      if (route === null) return null;
      const provider = snapshot.providers.find((candidate) => candidate.provider === route.provider);
      if (provider === void 0) return null;
      const view = snapshot.namespaces[provider.settingsNs];
      if (view === void 0) return null;
      const scope = [...provider.settingsPath];
      const entryPath = entryPathOf(view.value, scope, route.model);
      if (entryPath === null) return null;
      const entry = getPath(view.value, entryPath);
      if (!isRecord(entry)) return null;
      const inputField = inputFieldOf(entry, provider.settingsNs);
      const input = stringList(entry[inputField]);
      const contextWindow = numberOrUndefined(entry.contextWindow);
      const maxTokens = numberOrUndefined(entry.maxTokens);
      const defaultContextWindow = numberOrUndefined(getPath(view.value, [...scope, "defaultContextWindow"]));
      const defaultInput = stringList(getPath(view.value, [...scope, "defaultInput"]));
      const userEntry = getPath(view.user, entryPath);
      const declared = isRecord(userEntry) && (userEntry.contextWindow !== void 0 || userEntry[inputField] !== void 0);
      return {
        ns: provider.settingsNs,
        entryPath,
        inputField,
        revision: view.revision,
        input,
        defaultInput,
        declared,
        ...contextWindow === void 0 ? {} : { contextWindow },
        ...defaultContextWindow === void 0 ? {} : { defaultContextWindow },
        ...maxTokens === void 0 ? {} : { maxTokens }
      };
    }
    var ParamsStore = class {
      /**
       * @param face - the Host settings + provider directory faces, or null when
       *   this deployment mounts neither (the panel then stays read-only).
       */
      constructor(face) {
        this.face = face;
      }
      listeners = /* @__PURE__ */ new Set();
      snapshot = INITIAL_SNAPSHOT;
      inflight = null;
      /** Subscribe to snapshot changes. @param listener - called after any change. */
      subscribe(listener) {
        this.listeners.add(listener);
        return () => {
          this.listeners.delete(listener);
        };
      }
      /**
       * The current snapshot, stable until something changes.
       * @returns the snapshot handed to React.
       */
      getSnapshot() {
        return this.snapshot;
      }
      /**
       * Read the Host once. Repeated calls while a read is in flight join it, and a
       * snapshot already in hand is never refetched by this method.
       */
      ensure() {
        if (this.snapshot.status === "idle") void this.read();
      }
      /**
       * Re-read the Host, keeping the last good values while the answer is in
       * flight so an open panel does not blank out on a refresh.
       * @returns a promise settling when the snapshot has been updated.
       */
      refresh() {
        return this.read();
      }
      /**
       * Apply one write and keep the snapshot in step with the Host's answer.
       *
       * A `settings/conflict` is retried once against a freshly read revision: the
       * panel's edit is a single field, so re-applying it over the newer document is
       * what the person asked for, while a second conflict is reported as-is.
       * @param ns - the settings namespace to write.
       * @param ops - the path-addressed edits.
       * @param expectedRevision - the revision the caller read.
       * @returns whether the Host accepted the write, and why not when it did not.
       */
      async write(ns, ops, expectedRevision) {
        const face = this.face;
        if (face === null) return { ok: false, conflict: false, message: "settings are unavailable" };
        let response = await face.settings.mutate(ns, ops, expectedRevision);
        if (!response.ok && response.error.code === "settings/conflict") {
          await this.read();
          response = await face.settings.mutate(ns, ops, this.snapshot.namespaces[ns]?.revision);
        }
        if (!response.ok) {
          return { ok: false, conflict: response.error.code === "settings/conflict", message: response.error.message };
        }
        this.publish({
          ...this.snapshot,
          status: "ready",
          error: null,
          namespaces: { ...this.snapshot.namespaces, [response.value.ns]: response.value }
        });
        return { ok: true };
      }
      /** Read the provider directory and every namespace, then publish one snapshot. */
      read() {
        if (this.inflight !== null) return this.inflight;
        const face = this.face;
        if (face === null) {
          this.publish({ ...this.snapshot, status: "unavailable" });
          return Promise.resolve();
        }
        this.publish({ ...this.snapshot, status: this.snapshot.status === "ready" ? "ready" : "loading" });
        this.inflight = (async () => {
          const [providers, describe] = await Promise.all([
            face.llm.listConfigurableProviders(),
            face.settings.describe()
          ]);
          this.inflight = null;
          const failures = [];
          if (!providers.ok) failures.push(providers.error.message);
          if (!describe.ok) failures.push(describe.error.message);
          const namespaces = { ...this.snapshot.namespaces };
          if (describe.ok) {
            for (const view of describe.value.namespaces) namespaces[view.ns] = view;
          }
          this.publish({
            status: failures.length === 0 ? "ready" : "error",
            error: failures.length === 0 ? null : failures.join(" · "),
            writable: describe.ok ? describe.value.writable : this.snapshot.writable,
            providers: providers.ok ? providers.value : this.snapshot.providers,
            namespaces
          });
        })().catch((error) => {
          this.inflight = null;
          this.publish({
            ...this.snapshot,
            status: "error",
            error: error instanceof Error ? error.message : String(error)
          });
        });
        return this.inflight;
      }
      /** Replace the snapshot and wake every subscriber. */
      publish(snapshot) {
        this.snapshot = snapshot;
        for (const listener of this.listeners) listener();
      }
    };
    
    // src/client/prefs.ts
    var PROVIDER_KEY_PREFIX = "dsh-model-picker.provider.v1:";
    var LEGACY_PROVIDER_KEY = "dsh-model-picker.provider.v1";
    function storage() {
      try {
        return window.localStorage;
      } catch {
        return null;
      }
    }
    function providerKeyOf(sessionId) {
      return `${PROVIDER_KEY_PREFIX}${sessionId}`;
    }
    function readProviderFilter(sessionId) {
      const store = storage();
      if (store === null) return null;
      try {
        const raw = store.getItem(providerKeyOf(sessionId));
        return raw === null || raw === "" ? null : raw;
      } catch {
        return null;
      }
    }
    function rememberProviderFilter(sessionId, provider) {
      const store = storage();
      if (store === null) return;
      try {
        const key = providerKeyOf(sessionId);
        if (provider === null) store.removeItem(key);
        else store.setItem(key, provider);
      } catch {
      }
    }
    function retireLegacyProviderFilter() {
      const store = storage();
      if (store === null) return;
      try {
        store.removeItem(LEGACY_PROVIDER_KEY);
      } catch {
      }
    }
    
    // src/client/Picker.tsx
    var import_dsh_client_ui_primitives3 = require("@deepseek-ai/dsh-client-ui-primitives");
    var import_react3 = require("react");
    var import_react_dom3 = require("react-dom");
    
    // src/client/BadgeIcons.tsx
    var import_jsx_runtime = require("react/jsx-runtime");
    var BADGE_STROKE = 1.6;
    var BRAIN_STROKE = 2.4;
    var SLASH = {
      16: "M3.8 3.8 L12.2 12.2",
      24: "M5.7 5.7 L18.3 18.3"
    };
    var BRAIN = [
      "M3.87326 10.9728C3.65146 10.5059 3.52734 9.98359 3.52734 9.43228C3.52734 7.71144 4.73657 6.27302 6.35167 5.92041",
      "M20.1268 10.9728C20.3487 10.5059 20.4728 9.98359 20.4728 9.43228C20.4728 7.71144 19.2635 6.27302 17.6484 5.92041",
      "M5.58108 10.9731C3.87945 10.9731 2.5 12.3526 2.5 14.0542C2.5 15.7559 3.87945 17.1353 5.58108 17.1353C6.03924 17.1353 6.47405 17.0353 6.86486 16.8559L7.37838 16.6218",
      "M18.4184 10.9731C20.12 10.9731 21.4995 12.3526 21.4995 14.0542C21.4995 15.7559 20.12 17.1353 18.4184 17.1353C17.9602 17.1353 17.5254 17.0353 17.1346 16.8559L16.6211 16.6218",
      "M12.0013 5.22866C12.0013 3.73973 10.7943 2.53271 9.30532 2.53271C7.81639 2.53271 6.60938 3.73973 6.60938 5.22866C6.60938 6.11056 7.03282 6.89355 7.68749 7.38542",
      "M12 5.19595C12 3.70702 13.207 2.5 14.6959 2.5C16.1849 2.5 17.3919 3.70702 17.3919 5.19595C17.3919 6.07784 16.9684 6.86084 16.3138 7.3527",
      "M12 5.06738V17.6485",
      "M11.9996 17.6488C11.9996 19.7758 10.2753 21.5001 8.14823 21.5001C6.02118 21.5001 4.29688 19.7758 4.29688 17.6488V17.1353",
      "M12 17.6488C12 19.7758 13.7243 21.5001 15.8514 21.5001C17.9784 21.5001 19.7027 19.7758 19.7027 17.6488V17.1353"
    ];
    function artworkOf(fact, off) {
      switch (fact) {
        case "text":
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4.1 5.2 H11.9" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 5.2 V11.4" })
          ] });
        case "image":
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "2.75", y: "3.75", width: "10.5", height: "8.5", rx: "1.5" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3.7 10.9 L6.6 7.7 L8.9 9.9 L10.3 8.3 L12.3 10.4" }),
            !off && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "5.8", cy: "6.5", r: "0.85" })
          ] });
        case "effort":
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: BRAIN.map((path) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: path }, path)) });
        case "context":
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "2.75", y: "3.75", width: "10.5", height: "8.5", rx: "1.5" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2.75 6.5 H13.25" }),
            !off && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5.1 8.9 H10.9" })
          ] });
      }
    }
    function BadgeIcon({ fact, off = false, size = 14, className }) {
      const brain = fact === "effort";
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "svg",
        {
          className,
          width: size,
          height: size,
          viewBox: brain ? "0 0 24 24" : "0 0 16 16",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: brain ? BRAIN_STROKE : BADGE_STROKE,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          "aria-hidden": "true",
          focusable: "false",
          xmlns: "http://www.w3.org/2000/svg",
          children: [
            artworkOf(fact, off),
            off && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: brain ? SLASH[24] : SLASH[16] })
          ]
        }
      );
    }
    
    // src/client/anchorLoss.ts
    var CONFIRM_LOOKS = 2;
    var CONFIRM_DELAY_MS = 16;
    function occupiesPage(element) {
      return element.isConnected && element.getClientRects().length > 0;
    }
    function seatLeftThePage(element) {
      return element === null || occupiesPage(element) === false;
    }
    function observeSeatLoss(root, onLost) {
      let frames = 0;
      let reported = false;
      let stopped = false;
      let timer = null;
      const confirm = () => {
        if (stopped || reported) return;
        if (seatLeftThePage(root()) === false) {
          frames = 0;
          return;
        }
        frames += 1;
        if (frames < CONFIRM_LOOKS) {
          timer = window.setTimeout(confirm, CONFIRM_DELAY_MS);
          return;
        }
        reported = true;
        onLost();
      };
      const observer = new ResizeObserver(confirm);
      const element = root();
      if (element !== null) observer.observe(element);
      return () => {
        stopped = true;
        observer.disconnect();
        if (timer !== null) window.clearTimeout(timer);
      };
    }
    
    // src/client/effort.ts
    function effortLabelOf(reasoning, effort, t) {
      if (effort === void 0) return t("effort.providerDefault");
      return reasoning.efforts.find((level) => level.id === effort)?.name ?? effort;
    }
    function effortChoicesOf(reasoning, t) {
      return [
        ...reasoning.defaultEffort === void 0 ? [{ key: "provider-default", effort: void 0, label: t("effort.providerDefault") }] : [],
        ...reasoning.efforts.map((level) => ({ key: `effort:${level.id}`, effort: level.id, label: level.name }))
      ];
    }
    
    // src/client/format.ts
    function formatWindow(tokens) {
      if (!Number.isFinite(tokens) || tokens <= 0) return "";
      if (tokens < 1e3) return String(Math.round(tokens));
      if (tokens < 1e6) {
        const thousands = Math.round(tokens / 1e3);
        return thousands >= 1e3 ? "1M" : `${thousands}K`;
      }
      return `${Math.round(tokens / 1e6)}M`;
    }
    
    // src/client/badges.ts
    function modalitiesOf(address) {
      if (address === null) return void 0;
      if (address.input.length > 0) return address.input;
      if (address.defaultInput.length > 0) return address.defaultInput;
      return void 0;
    }
    function capacityOf(address) {
      if (address === null) return void 0;
      return address.contextWindow ?? address.defaultContextWindow;
    }
    function badgeSpecsOf({ address, reasoning, effort, t }) {
      const specs = [];
      const modalities = modalitiesOf(address);
      if (modalities !== void 0) {
        const text = modalities.includes("text");
        specs.push({
          fact: "text",
          off: !text,
          value: "",
          sentence: t(text ? "badge.text.on" : "badge.text.off")
        });
        const image = modalities.includes("image");
        specs.push({
          fact: "image",
          off: !image,
          value: "",
          sentence: t(image ? "badge.image.on" : "badge.image.off")
        });
      }
      if (reasoning === void 0) {
        specs.push({ fact: "effort", off: true, value: "", sentence: t("badge.effort.none") });
      } else {
        const label = effortLabelOf(reasoning, effort, t);
        specs.push({ fact: "effort", off: false, value: label, sentence: t("badge.effort", { level: label }) });
      }
      const capacity = capacityOf(address);
      if (capacity !== void 0) {
        const value = formatWindow(capacity);
        if (value !== "") {
          specs.push({ fact: "context", off: false, value, sentence: t("badge.context", { value }) });
        }
      }
      return specs;
    }
    
    // src/client/ProviderMenu.tsx
    var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
    var import_react = require("react");
    var import_react_dom = require("react-dom");
    var import_jsx_runtime2 = require("react/jsx-runtime");
    var MEASURE_STYLE = { visibility: "hidden", left: 0, top: 0 };
    function ProviderMenu({
      anchorRef,
      panelRef,
      idPrefix,
      side,
      options,
      current,
      busy,
      t,
      onPick,
      onClose
    }) {
      const [query, setQuery] = (0, import_react.useState)("");
      const searchRef = (0, import_react.useRef)(null);
      const rowRefs = (0, import_react.useRef)([]);
      const viewportRef = (0, import_react.useRef)(null);
      const position = (0, import_dsh_client_ui_primitives.useAnchoredPosition)({ open: true, anchorRef, panelRef, side, align: "end", gap: 8, margin: 12 });
      const listId = (0, import_react.useId)();
      const searchable = (0, import_react.useMemo)(() => options.map((option) => ({ name: option.label, option })), [options]);
      const visible = (0, import_react.useMemo)(
        () => (0, import_dsh_client_ui_primitives.rankByName)(searchable, query.trim()).map((entry) => entry.option),
        [searchable, query]
      );
      (0, import_react.useEffect)(() => {
        const viewport = viewportRef.current;
        if (viewport === null) return;
        return (0, import_dsh_client_ui_primitives.observeStickyMenuGroups)(viewport);
      }, [visible]);
      (0, import_react.useLayoutEffect)(() => {
        if (position === null) return;
        searchRef.current?.focus();
      }, [position]);
      const moveTab = (delta) => {
        const chain = [
          searchRef.current,
          ...rowRefs.current.filter((row) => row !== null && !row.disabled)
        ];
        const elements = chain.filter((element) => element !== null);
        if (elements.length === 0) return;
        const active = document.activeElement instanceof HTMLElement ? elements.indexOf(document.activeElement) : -1;
        const next = active === -1 ? delta > 0 ? 0 : elements.length - 1 : active + delta;
        elements[(next + elements.length) % elements.length]?.focus();
      };
      const onKeyDown = (event) => {
        if (event.nativeEvent.isComposing) return;
        switch (event.key) {
          case "Escape":
          case "ArrowLeft":
            event.preventDefault();
            event.stopPropagation();
            onClose(true);
            return;
          case "ArrowDown":
          case "ArrowUp": {
            event.preventDefault();
            event.stopPropagation();
            moveTab(event.key === "ArrowDown" ? 1 : -1);
            return;
          }
          case "Tab":
            event.preventDefault();
            event.stopPropagation();
            moveTab(event.shiftKey ? -1 : 1);
            return;
          default:
        }
      };
      rowRefs.current = [];
      return (0, import_react_dom.createPortal)(
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
          import_dsh_client_ui_primitives.MenuSurface,
          {
            ref: panelRef,
            id: `${idPrefix}-provider-menu`,
            className: "dmp-menu dmp-provider-menu",
            style: position ?? MEASURE_STYLE,
            role: "group",
            "aria-label": t("provider.menuAria"),
            onKeyDown,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dmp-search-row", children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  import_dsh_client_ui_primitives.Input,
                  {
                    ref: searchRef,
                    className: query === "" ? "dmp-search" : "dmp-search dmp-search-with-query",
                    type: "text",
                    role: "searchbox",
                    "aria-label": t("provider.search"),
                    "aria-controls": listId,
                    placeholder: t("provider.search"),
                    value: query,
                    onChange: (event) => {
                      setQuery(event.target.value);
                    }
                  }
                ),
                query !== "" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  "button",
                  {
                    type: "button",
                    className: "dmp-search-clear",
                    "aria-label": t("search.clear"),
                    onClick: () => {
                      setQuery("");
                      searchRef.current?.focus();
                    },
                    children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_dsh_client_ui_primitives.IconCloseFillRegular, {})
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "div",
                {
                  ref: viewportRef,
                  id: listId,
                  className: "dmp-groups scrollable",
                  role: "menu",
                  "aria-label": t("provider.group"),
                  hidden: visible.length === 0,
                  children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_dsh_client_ui_primitives.MenuGroup, { label: t("provider.group"), children: visible.map((option, index) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                    "button",
                    {
                      ref: (element) => {
                        rowRefs.current[index] = element;
                      },
                      type: "button",
                      role: "menuitemradio",
                      "aria-checked": option.id === current,
                      className: "dmp-row",
                      disabled: busy || option.failed,
                      onClick: () => {
                        onPick(option.id);
                      },
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "dmp-row-copy", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dmp-row-name", children: option.label }),
                          option.session && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dmp-provider-session", children: t("provider.sessionHere") })
                        ] }),
                        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: option.failed ? "dmp-provider-failed" : "dmp-provider-count", children: [
                          option.failed && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dmp-provider-failed-dot", "aria-hidden": "true" }),
                          option.failed ? t("provider.failed") : option.count
                        ] }),
                        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dmp-check", children: option.id === current ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_dsh_client_ui_primitives.IconCheckOutlineRegular, {}) : null })
                      ]
                    },
                    option.id ?? "all"
                  )) })
                }
              ),
              visible.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dmp-status", role: "status", children: t("search.empty") })
            ]
          }
        ),
        document.body
      );
    }
    
    // src/client/recent.ts
    var RECENT_ID = "__recent__";
    var STORAGE_KEY = "dsh-model-picker.recent.v1";
    var LIMIT = 12;
    var RECENT_VISIBLE = 5;
    function recentGroupsFor(rows, orderedGroups, label) {
      const groups = /* @__PURE__ */ new Map();
      for (const row of rows) {
        const group = orderedGroups.find((candidate) => candidate.id === row.provider);
        if (group === void 0) continue;
        const existing = groups.get(group.id);
        groups.set(group.id, {
          id: group.id,
          label: label(group.id, group.name),
          rows: existing === void 0 ? [row] : [...existing.rows, row]
        });
      }
      return [...groups.values()];
    }
    function rowKey(provider, model) {
      return `${provider}/${model}`;
    }
    function storage2() {
      try {
        return window.localStorage;
      } catch {
        return null;
      }
    }
    function readRecent() {
      const store = storage2();
      if (store === null) return [];
      let parsed;
      try {
        const raw = store.getItem(STORAGE_KEY);
        if (raw === null) return [];
        parsed = JSON.parse(raw);
      } catch {
        return [];
      }
      if (!Array.isArray(parsed)) return [];
      const entries = [];
      for (const value of parsed) {
        if (typeof value !== "object" || value === null) continue;
        const { provider, model, at } = value;
        if (typeof provider !== "string" || provider === "") continue;
        if (typeof model !== "string" || model === "") continue;
        entries.push({ key: rowKey(provider, model), provider, model, at: typeof at === "number" ? at : 0 });
      }
      return entries;
    }
    function remember(provider, model, at = Date.now()) {
      const store = storage2();
      if (store === null) return;
      const key = rowKey(provider, model);
      const next = [
        { key, provider, model, at },
        ...readRecent().filter((entry) => entry.key !== key)
      ].slice(0, LIMIT);
      try {
        store.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
      }
    }
    
    // src/client/SettingsMenu.tsx
    var import_dsh_client_ui_primitives2 = require("@deepseek-ai/dsh-client-ui-primitives");
    var import_react2 = require("react");
    var import_react_dom2 = require("react-dom");
    
    // src/client/panelCopy.ts
    function modalityLabel(modalities, t) {
      return modalities.map((modality) => modality === "text" ? t("settings.input.text") : modality === "image" ? t("settings.input.image") : modality).join(t("settings.listJoin"));
    }
    function noticeOf(state, t) {
      const line = noticeKeyOf(state);
      if (line === null) return null;
      return line.key === "settings.loadFailed" ? { key: line.key, params: { message: state.snapshot.error ?? "" } } : line;
    }
    function noticeKeyOf(state) {
      if (state.busy) return { key: "settings.busy" };
      if (state.snapshot.status === "loading" || state.snapshot.status === "idle") {
        return { key: "settings.loading" };
      }
      if (state.snapshot.status === "unavailable") return { key: "settings.unavailable" };
      if (state.snapshot.status === "error") return { key: "settings.loadFailed" };
      if (state.address === null) return { key: "settings.unaddressable" };
      if (!state.snapshot.writable) return { key: "settings.readonly" };
      return null;
    }
    function inputHintOf(state, t) {
      if (noticeOf(state, t) !== null) return null;
      const address = state.address;
      if (address === null) return null;
      if (address.input.length > 0) {
        return { key: "settings.input.declared", params: { list: modalityLabel(address.input, t) } };
      }
      if (address.defaultInput.length > 0) {
        return { key: "settings.input.default", params: { list: modalityLabel(address.defaultInput, t) } };
      }
      return { key: "settings.input.defaultUnknown" };
    }
    function contextHintOf(state, t) {
      if (state.capacityError) return { key: "settings.context.invalid" };
      const address = state.address;
      if (address === null) return null;
      if (noticeOf(state, t) !== null) return null;
      if (address.contextWindow !== void 0) return { key: "settings.context.declared" };
      if (address.defaultContextWindow !== void 0) {
        return { key: "settings.context.default", params: { value: formatContext(address.defaultContextWindow) } };
      }
      return { key: "settings.context.unset" };
    }
    function contextFieldOf(address) {
      if (address === null) return { value: "", placeholder: CONTEXT_PLACEHOLDER };
      const declared = address.contextWindow;
      const fallback = address.defaultContextWindow;
      return {
        value: declared === void 0 ? "" : formatContext(declared),
        placeholder: declared === void 0 ? fallback === void 0 ? CONTEXT_PLACEHOLDER : formatContext(fallback) : formatContext(declared)
      };
    }
    function shownInputOf(address) {
      if (address === null) return [];
      if (address.input.length > 0) return address.input;
      if (address.defaultInput.length > 0) return address.defaultInput;
      return PANEL_MODALITIES;
    }
    function restoreIsEmpty(state) {
      const address = state.address;
      if (address === null) return false;
      if (noticeKeyOf(state) !== null) return false;
      return address.input.length === 0 && address.contextWindow === void 0;
    }
    function showsContextField(address) {
      return address !== null;
    }
    function capacityAction(draft, committed, declaredTokens, parse) {
      if (draft === null || draft === committed) return { kind: "skip" };
      const text = draft.trim();
      if (text === "") {
        return declaredTokens === void 0 ? { kind: "skip" } : { kind: "unset" };
      }
      const tokens = parse(text);
      if (tokens === null) return { kind: "reject" };
      if (tokens === declaredTokens) return { kind: "normalize", text: formatContext(tokens) };
      return { kind: "set", value: tokens };
    }
    
    // src/client/SettingsMenu.tsx
    var import_jsx_runtime3 = require("react/jsx-runtime");
    var MEASURE_STYLE2 = { visibility: "hidden", left: 0, top: 0 };
    function modelOf(store, route) {
      const group = store.getSnapshot().groups.find((candidate) => candidate.id === route.provider);
      return group?.models.find((candidate) => candidate.id === route.model) ?? null;
    }
    function SettingsMenu({
      anchorRef,
      panelRef,
      idPrefix,
      side,
      directory,
      params,
      busy,
      maxHeight,
      t,
      onSelect,
      onClose
    }) {
      const [capacityDraft, setCapacityDraft] = (0, import_react2.useState)(null);
      const [capacityError, setCapacityError] = (0, import_react2.useState)(false);
      const [writing, setWriting] = (0, import_react2.useState)(false);
      const [writeError, setWriteError] = (0, import_react2.useState)(null);
      const current = (0, import_react2.useSyncExternalStore)(
        (subscribe) => directory.subscribe(subscribe),
        () => directory.getSnapshot().current
      );
      const snapshot = (0, import_react2.useSyncExternalStore)(
        (subscribe) => params.subscribe(subscribe),
        () => params.getSnapshot()
      );
      const position = (0, import_dsh_client_ui_primitives2.useAnchoredPosition)({ open: true, anchorRef, panelRef, side, align: "end", gap: 8, margin: 12 });
      (0, import_react2.useEffect)(() => {
        params.ensure();
      }, [params]);
      const route = current === null ? null : { provider: current.provider, model: current.model };
      const address = (0, import_react2.useMemo)(
        () => resolveRoute(snapshot, route),
        [snapshot, route?.provider, route?.model]
      );
      const model = route === null ? null : modelOf(directory, route);
      const reasoning = model?.reasoning;
      const choices = (0, import_react2.useMemo)(
        () => reasoning === void 0 ? [] : effortChoicesOf(reasoning, t),
        [reasoning, t]
      );
      const activeEffort = current?.reasoningEffort ?? reasoning?.defaultEffort;
      const activeLabel = reasoning === void 0 ? void 0 : effortLabelOf(reasoning, activeEffort, t);
      const modelLabel = model?.name ?? (route === null ? "" : `${route.provider}/${route.model}`);
      const copyState = { address, snapshot, busy, capacityError };
      const noticeLine = noticeOf(copyState, t);
      const sectionNotice = noticeLine === null ? null : t(noticeLine.key, noticeLine.params);
      const inputHintLine = inputHintOf(copyState, t);
      const inputHint = inputHintLine === null ? null : [
        t(inputHintLine.key, inputHintLine.params),
        restoreIsEmpty(copyState) ? t("settings.resetNothing") : null
      ].filter((part) => part !== null).join(" ");
      const contextHintLine = contextHintOf(copyState, t);
      const contextHint = contextHintLine === null ? null : t(contextHintLine.key, contextHintLine.params);
      const shownInput = shownInputOf(address);
      const contextField = contextFieldOf(address);
      const editable = address !== null && snapshot.writable && !busy && !writing;
      const capacity = capacityDraft ?? contextField.value;
      const chain = () => {
        const panel = panelRef.current;
        if (panel === null) return [];
        return [
          ...panel.querySelectorAll('[role="switch"]'),
          panel.querySelector(".dmp-settings-input input"),
          ...panel.querySelectorAll(".dmp-effort-item"),
          panel.querySelector(".dmp-settings-reset")
        ].filter((item) => item !== null && !item.hasAttribute("disabled"));
      };
      const tookFocus = (0, import_react2.useRef)(false);
      (0, import_react2.useLayoutEffect)(() => {
        if (position === null || tookFocus.current) return;
        tookFocus.current = true;
        panelRef.current?.focus();
      }, [position]);
      const addressId = address === null ? "" : `${address.ns}#${address.entryPath.join(".")}`;
      (0, import_react2.useEffect)(() => {
        setCapacityDraft(null);
        setCapacityError(false);
        setWriteError(null);
      }, [addressId, contextField.value]);
      const move = (delta) => {
        const items = chain();
        if (items.length === 0) return;
        const active = document.activeElement instanceof HTMLElement ? items.indexOf(document.activeElement) : -1;
        const next = active === -1 ? delta > 0 ? 0 : items.length - 1 : (active + delta + items.length) % items.length;
        items[next]?.focus();
      };
      const onKeyDown = (event) => {
        if (event.nativeEvent.isComposing) return;
        switch (event.key) {
          case "Escape":
          case "ArrowLeft":
            event.preventDefault();
            event.stopPropagation();
            onClose(true);
            return;
          case "Tab":
            event.preventDefault();
            event.stopPropagation();
            move(event.shiftKey ? -1 : 1);
            return;
          default:
        }
      };
      const write = (ops, done, failed) => {
        if (address === null) return;
        setWriting(true);
        setWriteError(null);
        void params.write(address.ns, ops, address.revision).then((outcome) => {
          setWriting(false);
          if (!outcome.ok) {
            failed?.();
            setWriteError(outcome.message);
            return;
          }
          done?.();
        });
      };
      const commitCapacity = () => {
        if (address === null || !editable) return;
        const action = capacityAction(capacityDraft, contextField.value, address.contextWindow, parseContext);
        switch (action.kind) {
          case "skip":
            return;
          case "reject":
            setCapacityError(true);
            return;
          case "normalize":
            setCapacityError(false);
            setCapacityDraft(action.text);
            return;
          case "unset":
            setCapacityError(false);
            write(
              [{ op: "unset", path: [...address.entryPath, "contextWindow"] }],
              () => {
                setCapacityDraft(null);
              },
              () => {
                setCapacityDraft(null);
              }
            );
            return;
          case "set":
            setCapacityError(false);
            write(
              [{ op: "set", path: [...address.entryPath, "contextWindow"], value: action.value }],
              () => {
                setCapacityDraft(formatContext(action.value));
              },
              // On a refusal the field goes back to what the Host actually holds.
              // Otherwise the rejected draft stays in the box, and the NEXT dismissal
              // re-issues the same refused mutation — a write per blur, forever, with
              // only "retype the declared value" as a way out. The refusal message is
              // what stays on screen; the draft does not.
              () => {
                setCapacityDraft(null);
              }
            );
        }
      };
      const toggleModality = (modality, on) => {
        if (address === null || !editable) return;
        const next = new Set(shownInput);
        if (on) next.add(modality);
        else next.delete(modality);
        const known = PANEL_MODALITIES.filter((candidate) => next.has(candidate));
        const extras = shownInput.filter((candidate) => !PANEL_MODALITIES.includes(candidate));
        const list = [...known, ...extras.filter((candidate) => candidate !== modality)];
        if (list.length === 0) {
          setWriteError(t("settings.input.needOne"));
          return;
        }
        write([{ op: "set", path: [...address.entryPath, address.inputField], value: list }]);
      };
      const restoreDefaults = () => {
        if (address === null || !editable) return;
        const ops = [];
        if (address.contextWindow !== void 0) {
          ops.push({ op: "unset", path: [...address.entryPath, "contextWindow"] });
        }
        if (address.input.length > 0) {
          ops.push({ op: "unset", path: [...address.entryPath, address.inputField] });
        }
        if (ops.length === 0) return;
        write(ops);
      };
      const pickEffort = (effort) => {
        if (route === null || reasoning === void 0) return;
        if ((activeEffort ?? void 0) === effort) return;
        onSelect({
          provider: route.provider,
          model: route.model,
          ...effort === void 0 ? {} : { reasoningEffort: effort }
        });
      };
      if (route === null) return null;
      const notice = writeError !== null ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dmp-settings-alert", role: "alert", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_dsh_client_ui_primitives2.IconWarningOutlineRegular, { className: "dmp-settings-alert-icon" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: t("settings.writeFailed", { message: writeError }) })
      ] }) : sectionNotice === null ? null : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dmp-settings-notice", children: sectionNotice });
      return (0, import_react_dom2.createPortal)(
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          import_dsh_client_ui_primitives2.MenuSurface,
          {
            ref: panelRef,
            id: `${idPrefix}-settings`,
            className: "dmp-menu dmp-settings",
            style: position === null ? MEASURE_STYLE2 : { ...position, maxHeight },
            role: "group",
            "aria-label": t("settings.aria", { model: modelLabel }),
            "aria-busy": writing || busy,
            tabIndex: -1,
            onKeyDown,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dmp-settings-head", children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dmp-settings-title", children: modelLabel }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "button",
                  {
                    type: "button",
                    className: "dmp-settings-reset",
                    "aria-label": t("settings.resetAria", { model: modelLabel }),
                    disabled: !editable || address === null || !address.declared,
                    onClick: restoreDefaults,
                    children: t("settings.reset")
                  }
                )
              ] }),
              notice,
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dmp-settings-body", children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dmp-settings-section", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dmp-settings-label", children: t("settings.input.title") }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dmp-settings-row", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dmp-settings-name", children: t("settings.input.text") }),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                      import_dsh_client_ui_primitives2.Switch,
                      {
                        className: "dmp-settings-switch",
                        checked: shownInput.includes("text"),
                        label: t("settings.input.text"),
                        disabled: !editable,
                        onChange: (next) => {
                          toggleModality("text", next);
                        }
                      }
                    )
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dmp-settings-row", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dmp-settings-name", children: t("settings.input.image") }),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                      import_dsh_client_ui_primitives2.Switch,
                      {
                        className: "dmp-settings-switch",
                        checked: shownInput.includes("image"),
                        label: t("settings.input.image"),
                        disabled: !editable,
                        onChange: (next) => {
                          toggleModality("image", next);
                        }
                      }
                    )
                  ] }),
                  inputHint !== null && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dmp-settings-hint", children: inputHint })
                ] }),
                showsContextField(address) && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dmp-settings-section", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dmp-settings-label", children: t("settings.context.title") }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dmp-settings-row", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                    import_dsh_client_ui_primitives2.Input,
                    {
                      className: capacityError ? "dmp-settings-input dmp-settings-input-bad" : "dmp-settings-input",
                      type: "text",
                      inputMode: "numeric",
                      disabled: !editable,
                      "aria-label": t("settings.context.title"),
                      "aria-invalid": capacityError || void 0,
                      placeholder: contextField.placeholder,
                      value: capacity,
                      onChange: (event) => {
                        setCapacityDraft(event.target.value);
                        setCapacityError(false);
                      },
                      onKeyDown: (event) => {
                        if (event.key !== "Enter") return;
                        event.preventDefault();
                        event.stopPropagation();
                        commitCapacity();
                      },
                      onBlur: () => {
                        commitCapacity();
                      }
                    }
                  ) }),
                  contextHint !== null && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dmp-settings-hint", children: contextHint })
                ] }),
                reasoning !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dmp-settings-section", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dmp-settings-label", children: t("settings.effort.title") }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dmp-effort-list", role: "radiogroup", "aria-label": t("settings.effort.title"), children: choices.map((choice) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
                    "button",
                    {
                      type: "button",
                      role: "radio",
                      "aria-checked": choice.label === activeLabel,
                      className: "dmp-effort-item",
                      disabled: busy,
                      onClick: () => {
                        pickEffort(choice.effort);
                      },
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dmp-effort-name", children: choice.label }),
                        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dmp-effort-check", children: choice.label === activeLabel ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_dsh_client_ui_primitives2.IconCheckOutlineRegular, {}) : null })
                      ]
                    },
                    choice.key
                  )) })
                ] }),
                address !== null && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dmp-settings-target", title: `${address.ns} · ${address.entryPath.join(".")}`, children: t("settings.target", { ns: address.ns, path: address.entryPath.join(".") }) }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dmp-settings-note", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_dsh_client_ui_primitives2.IconInfoOutlineRegular, { className: "dmp-settings-note-icon" }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: t("settings.note") })
                ] })
              ] })
            ]
          }
        ),
        document.body
      );
    }
    
    // src/client/Picker.tsx
    var import_jsx_runtime4 = require("react/jsx-runtime");
    var MEASURE_STYLE3 = { visibility: "hidden", left: 0, top: 0 };
    function orderProviders(groups) {
      return groups.slice().sort((left, right) => (left.id === "deepseek-account" ? 0 : left.id === "deepseek-official" ? 1 : 2) - (right.id === "deepseek-account" ? 0 : right.id === "deepseek-official" ? 1 : 2));
    }
    function recentRowsFor(catalog, recent, query, cap = RECENT_VISIBLE) {
      const rows = [];
      for (const entry of recent) {
        const found = catalog.find((row) => row.provider === entry.provider && row.model.id === entry.model);
        if (found === void 0) continue;
        if (query !== "" && (0, import_dsh_client_ui_primitives3.rankByName)([found.model], query).length === 0) continue;
        rows.push({ key: `recent:${found.provider}:${found.model.id}`, provider: found.provider, model: found.model });
        if (cap !== null && rows.length >= cap) break;
      }
      return rows;
    }
    function Picker(props) {
      const { locked, available, directory, load, select, params, translate, sessionId } = props;
      const t = props.t ?? translate;
      const state = (0, import_react3.useSyncExternalStore)(
        (subscribe) => directory.subscribe(subscribe),
        () => directory.getSnapshot()
      );
      const [open, setOpen] = (0, import_react3.useState)(false);
      const [query, setQuery] = (0, import_react3.useState)("");
      const [highlight, setHighlight] = (0, import_react3.useState)(null);
      const [recent, setRecent] = (0, import_react3.useState)([]);
      const [filterSession, setFilterSession] = (0, import_react3.useState)(sessionId);
      const [providerFilter, setProviderFilter] = (0, import_react3.useState)(() => readProviderFilter(sessionId));
      const [providerAt, setProviderAt] = (0, import_react3.useState)(false);
      const [providerSide, setProviderSide] = (0, import_react3.useState)("bottom");
      const [settingsAt, setSettingsAt] = (0, import_react3.useState)(false);
      const [settingsSide, setSettingsSide] = (0, import_react3.useState)("bottom");
      const [settingsBudget, setSettingsBudget] = (0, import_react3.useState)(void 0);
      const [selectionFocus, setSelectionFocus] = (0, import_react3.useState)(false);
      const [toast, setToast] = (0, import_react3.useState)(null);
      const toastSeq = (0, import_react3.useRef)(0);
      const rootRef = (0, import_react3.useRef)(null);
      const triggerRef = (0, import_react3.useRef)(null);
      const providerChipRef = (0, import_react3.useRef)(null);
      const providerMenuRef = (0, import_react3.useRef)(null);
      const settingsButtonRef = (0, import_react3.useRef)(null);
      const settingsMenuRef = (0, import_react3.useRef)(null);
      const searchRef = (0, import_react3.useRef)(null);
      const menuRef = (0, import_react3.useRef)(null);
      const groupsRef = (0, import_react3.useRef)(null);
      const rowRefs = (0, import_react3.useRef)([]);
      const lastActionRef = (0, import_react3.useRef)("load");
      const routeRef = (0, import_react3.useRef)(null);
      const id = (0, import_react3.useId)();
      const [settingsSession, setSettingsSession] = (0, import_react3.useState)(sessionId);
      if (settingsAt && settingsSession !== sessionId) {
        setSettingsAt(false);
        setSettingsSession(sessionId);
      }
      if (filterSession !== sessionId) {
        setFilterSession(sessionId);
        setProviderFilter(readProviderFilter(sessionId));
      }
      const menuPos = (0, import_dsh_client_ui_primitives3.useAnchoredPosition)({
        open,
        anchorRef: triggerRef,
        panelRef: menuRef,
        side: "top",
        align: "end",
        gap: 8,
        margin: 12
      });
      const orderedGroups = (0, import_react3.useMemo)(() => orderProviders(state.groups), [state.groups]);
      const catalogRows = (0, import_react3.useMemo)(() => orderedGroups.flatMap((group) => group.models.map((model) => ({ key: `${group.id}:${model.id}`, provider: group.id, model }))), [orderedGroups]);
      const selectedKey = state.current === null ? null : rowKey(state.current.provider, state.current.model);
      const currentRow = catalogRows.find((row) => rowKey(row.provider, row.model.id) === selectedKey) ?? null;
      const currentReasoning = currentRow?.model.reasoning;
      const effectiveEffort = state.current?.reasoningEffort ?? currentReasoning?.defaultEffort;
      const effortLabel = currentReasoning === void 0 ? state.retainedEffort : effortLabelOf(currentReasoning, effectiveEffort, t);
      const paramsSnapshot = (0, import_react3.useSyncExternalStore)(
        (subscribe) => params.subscribe(subscribe),
        () => params.getSnapshot()
      );
      const declaredCurrent = resolveRoute(paramsSnapshot, state.current)?.declared === true;
      const specsByRow = (0, import_react3.useMemo)(() => {
        const map = /* @__PURE__ */ new Map();
        for (const row of catalogRows) {
          const selected = row.provider === state.current?.provider && row.model.id === state.current.model;
          map.set(rowKey(row.provider, row.model.id), badgeSpecsOf({
            address: resolveRoute(paramsSnapshot, { provider: row.provider, model: row.model.id }),
            reasoning: row.model.reasoning,
            // The effort in force: what the Host accepted on the selected row, else
            // the level the adapter would start this model at.
            effort: selected ? effectiveEffort : row.model.reasoning?.defaultEffort,
            t
          }));
        }
        return map;
      }, [catalogRows, effectiveEffort, paramsSnapshot, state.current, t]);
      const trimmedQuery = query.trim();
      const providerLabel = (0, import_react3.useCallback)(
        (providerId, fallback) => providerId === "deepseek-account" ? t("provider.account") : fallback,
        [t]
      );
      const groups = (0, import_react3.useMemo)(() => {
        if (providerFilter === RECENT_ID) {
          return recentGroupsFor(recentRowsFor(catalogRows, recent, trimmedQuery), orderedGroups, providerLabel);
        }
        const ranked = (0, import_dsh_client_ui_primitives3.rankByName)(catalogRows.map((row) => row.model), trimmedQuery);
        const rankOf = new Map(ranked.map((model, index) => [model, index]));
        const bestRank = (candidate) => candidate.rows.reduce(
          (best, row) => Math.min(best, rankOf.get(row.model) ?? Number.MAX_SAFE_INTEGER),
          Number.MAX_SAFE_INTEGER
        );
        const scoped = providerFilter === null ? orderedGroups : orderedGroups.filter((group) => group.id === providerFilter);
        return scoped.map((group) => ({
          id: group.id,
          label: providerLabel(group.id, group.name),
          rows: (0, import_dsh_client_ui_primitives3.rankByName)(group.models, trimmedQuery).map((model) => ({
            key: `${group.id}:${model.id}`,
            provider: group.id,
            model
          }))
        })).filter((group) => group.rows.length > 0).sort((left, right) => bestRank(left) - bestRank(right));
      }, [catalogRows, orderedGroups, providerFilter, providerLabel, recent, trimmedQuery]);
      const presentRecentCount = (0, import_react3.useMemo)(
        () => recentRowsFor(catalogRows, recent, "", RECENT_VISIBLE).length,
        [catalogRows, recent]
      );
      const providerOptions = (0, import_react3.useMemo)(() => [
        { id: null, label: t("provider.all"), count: catalogRows.length, failed: false, session: false },
        { id: RECENT_ID, label: t("group.recent"), count: presentRecentCount, failed: false, session: false },
        ...orderedGroups.map((group) => ({
          id: group.id,
          label: providerLabel(group.id, group.name),
          count: group.models.length,
          failed: false,
          session: group.id === state.current?.provider
        })),
        ...state.failures.map((failure) => ({
          id: failure.id,
          label: providerLabel(failure.id, failure.name),
          count: 0,
          failed: true,
          session: failure.id === state.current?.provider
        }))
      ], [catalogRows.length, orderedGroups, presentRecentCount, providerLabel, state.current, state.failures, t]);
      const activeProviderId = providerFilter;
      const activeProviderLabel = activeProviderId === null ? t("provider.all") : (
        // Until the catalog loads there is no option to take a name from, so the
        // id stands in for itself (still localized when it names the account).
        providerOptions.find((option) => option.id === activeProviderId)?.label ?? providerLabel(activeProviderId, activeProviderId)
      );
      const knownProviders = (0, import_react3.useMemo)(() => new Set(
        providerOptions.flatMap((option) => option.id === null ? [] : [option.id])
      ), [providerOptions]);
      (0, import_react3.useEffect)(() => {
        rememberProviderFilter(filterSession, providerFilter);
      }, [filterSession, providerFilter]);
      (0, import_react3.useEffect)(() => {
        if (providerFilter === null || state.status !== "ready") return;
        if (knownProviders.has(providerFilter)) return;
        setProviderFilter(null);
      }, [knownProviders, providerFilter, state.status]);
      const rows = (0, import_react3.useMemo)(() => groups.flatMap((group) => group.rows), [groups]);
      const indexOfRow = (0, import_react3.useMemo)(() => new Map(rows.map((row, index) => [row.key, index])), [rows]);
      const currentVisibleIndex = rows.findIndex((row) => row.provider === state.current?.provider && row.model.id === state.current.model);
      const activeIndex = rows.length === 0 ? -1 : Math.min(highlight ?? Math.max(0, currentVisibleIndex), rows.length - 1);
      const pending = state.pending;
      const busy = pending !== null;
      const reload = () => {
        lastActionRef.current = "load";
        setRecent(readRecent());
        load();
      };
      (0, import_react3.useEffect)(() => {
        params.ensure();
      }, [params]);
      (0, import_react3.useEffect)(() => {
        if (state.current === null) return;
        const route = rowKey(state.current.provider, state.current.model);
        if (routeRef.current === route) return;
        routeRef.current = route;
        remember(state.current.provider, state.current.model);
        setRecent(readRecent());
      }, [state.current]);
      (0, import_react3.useEffect)(() => {
        if (!open && !providerAt && !settingsAt) return;
        const closeOutside = (event) => {
          const target = event.target;
          if (rootRef.current?.contains(target) === true) return;
          if (menuRef.current?.contains(target) === true) return;
          if (providerMenuRef.current?.contains(target) === true) return;
          if (settingsMenuRef.current?.contains(target) === true) return;
          setOpen(false);
          setProviderAt(false);
          setSettingsAt(false);
        };
        document.addEventListener("mousedown", closeOutside);
        return () => {
          document.removeEventListener("mousedown", closeOutside);
        };
      }, [open, providerAt, settingsAt]);
      (0, import_react3.useEffect)(() => {
        if (!open && !providerAt && !settingsAt) return;
        return observeSeatLoss(
          () => rootRef.current,
          () => {
            setOpen(false);
            setProviderAt(false);
            setSettingsAt(false);
            setSelectionFocus(false);
          }
        );
      }, [open, providerAt, settingsAt]);
      (0, import_react3.useEffect)(() => {
        const viewport = groupsRef.current;
        if (viewport === null) return;
        return (0, import_dsh_client_ui_primitives3.observeStickyMenuGroups)(viewport);
      }, [available, open, groups]);
      (0, import_react3.useLayoutEffect)(() => {
        if (!open || menuPos === null) return;
        const active = document.activeElement;
        if (active instanceof Node && menuRef.current?.contains(active) === true) return;
        searchRef.current?.focus();
      }, [open, menuPos]);
      (0, import_react3.useLayoutEffect)(() => {
        if (open && activeIndex >= 0) {
          rowRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
        }
      }, [open, activeIndex, rows]);
      if (!available) return null;
      const show = () => {
        setSelectionFocus(false);
        triggerRef.current?.focus();
        setQuery("");
        setHighlight(null);
        setProviderAt(false);
        setSettingsAt(false);
        setRecent(readRecent());
        setOpen(true);
        reload();
      };
      const close = (restoreFocus = false) => {
        setOpen(false);
        setProviderAt(false);
        setSettingsAt(false);
        if (restoreFocus) queueMicrotask(() => {
          triggerRef.current?.focus();
        });
      };
      const toggleProviderMenu = () => {
        if (providerAt) {
          setProviderAt(false);
          return;
        }
        const anchor = providerChipRef.current;
        const rect = anchor?.getBoundingClientRect();
        if (rect !== void 0 && rect !== null) {
          const estimated = (providerOptions.length + 1) * 34 + 44;
          const below = window.innerHeight - rect.bottom;
          setProviderSide(below < estimated && rect.top > below ? "top" : "bottom");
        }
        setOpen(false);
        setSettingsAt(false);
        setProviderAt(true);
      };
      const closeProviderMenu = (restoreToChip) => {
        setProviderAt(false);
        if (restoreToChip) queueMicrotask(() => {
          providerChipRef.current?.focus();
        });
      };
      const toggleSettings = () => {
        if (settingsAt) {
          setSettingsAt(false);
          return;
        }
        const rect = settingsButtonRef.current?.getBoundingClientRect();
        if (rect !== void 0) {
          const estimated = 330;
          const below = window.innerHeight - rect.bottom;
          const top = below < estimated && rect.top > below ? "top" : "bottom";
          setSettingsSide(top);
          const room = top === "top" ? rect.top - 28 : below - 28;
          setSettingsBudget(Math.max(240, Math.min(460, room)));
        }
        setOpen(false);
        setProviderAt(false);
        setSettingsAt(true);
      };
      const closeSettings = (restoreToGear) => {
        setSettingsAt(false);
        if (restoreToGear) queueMicrotask(() => {
          settingsButtonRef.current?.focus();
        });
      };
      const closeAfterSelection = () => {
        setSelectionFocus(true);
        close(true);
      };
      const showFailure = (text) => {
        toastSeq.current += 1;
        setToast({ seq: toastSeq.current, text });
      };
      const settleSelection = (result) => {
        if (result === void 0) return;
        if (result.ok) {
          if (rootRef.current !== null) closeAfterSelection();
          return;
        }
        const { error } = result;
        showFailure(error.code === "session/writer-held" ? t("error.sessionInUse") : t("error.action", { message: `${error.code}: ${error.message}` }));
      };
      const submit = (selection) => {
        lastActionRef.current = "select";
        setSelectionFocus(true);
        triggerRef.current?.focus();
        void select(selection).then(settleSelection);
      };
      const choose = (row) => {
        if (state.current?.provider === row.provider && state.current.model === row.model.id) {
          closeAfterSelection();
          return;
        }
        submit({ provider: row.provider, model: row.model.id });
      };
      const focusedIndexOf = () => {
        const active = document.activeElement;
        if (active === null) return null;
        const rowIndex = rowRefs.current.findIndex((element) => element === active);
        return rowIndex === -1 ? null : rowIndex;
      };
      const moveTab = (delta) => {
        const chain = [providerChipRef.current, searchRef.current];
        rows.forEach((_row, index) => {
          chain.push(rowRefs.current[index] ?? null);
        });
        const elements = chain.filter((element) => element !== null);
        if (elements.length === 0) return;
        const active = document.activeElement instanceof HTMLElement ? elements.indexOf(document.activeElement) : -1;
        const next = active === -1 ? delta > 0 ? 0 : elements.length - 1 : active + delta;
        if (next < 0) {
          close(true);
          return;
        }
        elements[next % elements.length]?.focus();
      };
      const onKeyDown = (event) => {
        if (event.nativeEvent.isComposing) return;
        if (providerAt || settingsAt) return;
        if (event.key === "Escape" && open) {
          event.preventDefault();
          if (query !== "") {
            setQuery("");
            setHighlight(null);
            searchRef.current?.focus();
            return;
          }
          close(true);
          return;
        }
        if (!open) return;
        const onSearch = document.activeElement === searchRef.current;
        if ((event.key === "ArrowDown" || event.key === "ArrowUp") && rows.length > 0) {
          event.preventDefault();
          const delta = event.key === "ArrowDown" ? 1 : -1;
          const base = highlight ?? activeIndex;
          const next = (base + delta + rows.length) % rows.length;
          if (onSearch) {
            setHighlight(next);
            rowRefs.current[next]?.scrollIntoView({ block: "nearest" });
          } else {
            setHighlight(next);
            rowRefs.current[next]?.focus();
          }
          return;
        }
        if (event.key === "Enter") {
          const index = focusedIndexOf();
          if (index !== null) {
            event.preventDefault();
            const row = rows[index];
            if (row === void 0 || busy) return;
            choose(row);
            return;
          }
          if (onSearch && activeIndex >= 0) {
            const row = rows[activeIndex];
            if (row !== void 0 && !busy) {
              event.preventDefault();
              choose(row);
            }
          }
          return;
        }
        if (event.key === "Tab") {
          event.preventDefault();
          moveTab(event.shiftKey ? -1 : 1);
        }
      };
      const onBlur = (event) => {
        const target = event.relatedTarget;
        if (target instanceof Node && (rootRef.current?.contains(target) === true || menuRef.current?.contains(target) === true || providerMenuRef.current?.contains(target) === true || settingsMenuRef.current?.contains(target) === true)) return;
        if (event.currentTarget.contains(document.activeElement) || document.activeElement === document.body) return;
        close();
      };
      const waiting = state.current === null && state.status === "loading";
      const modelLabel = waiting ? t("trigger.loading") : currentRow?.model.name ?? (state.current === null ? t("trigger.fallback") : `${state.current.provider}/${state.current.model}`);
      const triggerAria = waiting ? t("trigger.loading") : state.current === null ? t("trigger.selectAria") : effortLabel === void 0 ? t("trigger.aria", { model: modelLabel }) : t("trigger.ariaEffort", { model: modelLabel, effort: effortLabel });
      const settingsTitle = state.current === null ? t("settings.openNoModel") : declaredCurrent ? `${t("settings.open")} · ${t("settings.openDeclared")}` : t("settings.open");
      rowRefs.current = [];
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
        "div",
        {
          ref: rootRef,
          className: "dmp-root",
          onKeyDown,
          onBlur,
          onMouseDown: (event) => {
            if (event.target instanceof Element && event.target.closest('button,[role="menuitemradio"]') !== null) {
              event.preventDefault();
            }
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.Tooltip, { label: activeProviderLabel, side: "top", align: "end", portal: true, disabled: providerAt, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
              "button",
              {
                ref: providerChipRef,
                type: "button",
                className: providerAt ? "dmp-provider dmp-provider-open" : "dmp-provider",
                "aria-label": t("provider.chipAria", { name: activeProviderLabel }),
                "aria-haspopup": "menu",
                "aria-expanded": providerAt,
                "aria-controls": providerAt ? `${id}-provider-menu` : void 0,
                "data-filtered": providerFilter === null ? void 0 : "",
                "data-selection-focus": providerAt ? "" : void 0,
                disabled: locked,
                onClick: toggleProviderMenu,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.IconApiOutlineRegular, { className: "dmp-provider-icon", size: 16 }),
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dmp-provider-label", children: activeProviderLabel }),
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.IconChevronDownOutlineRegular, { className: providerAt ? "dmp-chevron dmp-chevron-open" : "dmp-chevron" })
                ]
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.Tooltip, { label: modelLabel, side: "top", align: "end", portal: true, disabled: open, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
              "button",
              {
                ref: triggerRef,
                type: "button",
                className: "dmp-trigger",
                "aria-label": triggerAria,
                "aria-haspopup": "menu",
                "aria-expanded": open,
                "aria-controls": open ? `${id}-menu` : void 0,
                "aria-busy": busy,
                "data-selection-focus": selectionFocus ? "" : void 0,
                onBlur: () => {
                  setSelectionFocus(false);
                },
                disabled: locked,
                onClick: () => {
                  if (open) close(true);
                  else show();
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.IconDataOutlineRegular, { className: "dmp-trigger-icon", size: 16 }),
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dmp-trigger-label", children: modelLabel }),
                  busy ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.StateDot, { state: "ongoing" }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.IconChevronDownOutlineRegular, { className: open ? "dmp-chevron dmp-chevron-open" : "dmp-chevron" })
                ]
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.Tooltip, { label: settingsTitle, side: "top", align: "end", portal: true, disabled: settingsAt, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
              "button",
              {
                ref: settingsButtonRef,
                type: "button",
                className: settingsAt ? "dmp-settings-button dmp-settings-open" : "dmp-settings-button",
                "aria-label": state.current === null ? t("settings.openNoModel") : t("settings.openAria", { model: modelLabel }),
                "aria-haspopup": "menu",
                "aria-expanded": settingsAt,
                "aria-controls": settingsAt ? `${id}-settings` : void 0,
                "data-edited": declaredCurrent ? "" : void 0,
                "data-selection-focus": settingsAt ? "" : void 0,
                disabled: locked || state.current === null,
                onClick: toggleSettings,
                children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.IconSettingsOutlineRegular, { className: "dmp-settings-icon", size: 16 })
              }
            ) }),
            open && (0, import_react_dom3.createPortal)(
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
                import_dsh_client_ui_primitives3.MenuSurface,
                {
                  ref: menuRef,
                  id: `${id}-menu`,
                  className: "dmp-menu",
                  style: menuPos ?? MEASURE_STYLE3,
                  role: "group",
                  "aria-label": t("menu.aria"),
                  "aria-busy": state.status === "loading" || busy,
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dmp-search-row", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                        import_dsh_client_ui_primitives3.Input,
                        {
                          ref: searchRef,
                          className: query === "" ? "dmp-search" : "dmp-search dmp-search-with-query",
                          type: "text",
                          role: "searchbox",
                          "aria-label": t("search.placeholder"),
                          "aria-controls": `${id}-models`,
                          "aria-activedescendant": activeIndex < 0 ? void 0 : `${id}-row-${activeIndex}`,
                          placeholder: t("search.placeholder"),
                          value: query,
                          onChange: (event) => {
                            setQuery(event.target.value);
                            setHighlight(0);
                          }
                        }
                      ),
                      query !== "" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                        "button",
                        {
                          type: "button",
                          className: "dmp-search-clear",
                          "aria-label": t("search.clear"),
                          disabled: busy,
                          onClick: () => {
                            setQuery("");
                            setHighlight(null);
                            searchRef.current?.focus();
                          },
                          children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.IconCloseFillRegular, {})
                        }
                      )
                    ] }),
                    state.status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "dmp-status", role: "status", children: t("status.loading") }),
                    providerFilter !== null && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dmp-filter-hint", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: t(providerFilter === RECENT_ID ? "provider.filteredRecent" : "provider.filtered", { name: activeProviderLabel }) }),
                      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                        "button",
                        {
                          type: "button",
                          className: "dmp-filter-clear",
                          disabled: busy,
                          onClick: () => {
                            setProviderFilter(null);
                          },
                          children: t("provider.showAll")
                        }
                      )
                    ] }),
                    state.error !== null && lastActionRef.current === "load" && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dmp-error", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.IconWarningOutlineRegular, { className: "dmp-error-icon" }),
                      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: t("error.action", { message: state.error }) }),
                      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", className: "dmp-retry", onClick: reload, children: t("action.reload") })
                    ] }),
                    state.failures.map((failure) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dmp-warning", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.IconWarningOutlineRegular, { className: "dmp-error-icon" }),
                      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: t("warning.groupLoad", {
                        name: providerLabel(failure.id, failure.name),
                        message: failure.message
                      }) }),
                      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", className: "dmp-retry", onClick: reload, children: t("action.reload") })
                    ] }, failure.id)),
                    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                      "div",
                      {
                        ref: groupsRef,
                        id: `${id}-models`,
                        className: "dmp-groups scrollable",
                        role: "menu",
                        "aria-label": t("menu.model"),
                        hidden: rows.length === 0,
                        children: groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.MenuGroup, { label: group.label, children: group.rows.map((row) => {
                          const index = indexOfRow.get(row.key) ?? -1;
                          const selected = row.provider === state.current?.provider && row.model.id === state.current.model;
                          const specs = specsByRow.get(rowKey(row.provider, row.model.id)) ?? [];
                          const facts = specs.map((spec) => spec.sentence).join(t("settings.listJoin"));
                          const rowPending = pending !== null && pending.provider === row.provider && pending.model === row.model.id;
                          return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
                            "div",
                            {
                              ref: (element) => {
                                rowRefs.current[index] = element;
                              },
                              id: `${id}-row-${index}`,
                              role: "menuitemradio",
                              "aria-checked": selected,
                              "aria-label": facts === "" ? row.model.name : t("badge.rowAria", { model: row.model.name, facts }),
                              "aria-disabled": busy || void 0,
                              "data-active": index === activeIndex ? "" : void 0,
                              className: "dmp-row",
                              tabIndex: -1,
                              onMouseDown: () => {
                                rowRefs.current[index]?.focus();
                              },
                              onMouseMove: busy || index === activeIndex ? void 0 : () => {
                                setHighlight(index);
                              },
                              onClick: () => {
                                if (!busy) choose(row);
                              },
                              children: [
                                /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "dmp-row-copy", children: [
                                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dmp-row-name", title: row.model.name, children: row.model.name }),
                                  specs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dmp-badges", title: facts, "aria-hidden": "true", children: specs.map((spec) => (
                                    // `Tag` renders a span, never a button: a fact badge
                                    // cannot be clicked into anything, by construction.
                                    // Every badge is the SAME two-cell capsule: the icon
                                    // cell states which fact, the text cell names its
                                    // value (or stays empty for the two yes/no ones).
                                    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
                                      import_dsh_client_ui_primitives3.Tag,
                                      {
                                        tone: spec.off ? "quiet" : "neutral",
                                        className: "dmp-badge",
                                        children: [
                                          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dmp-badge-fact", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(BadgeIcon, { fact: spec.fact, off: spec.off, className: "dmp-badge-icon" }) }),
                                          spec.value !== "" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dmp-badge-value", children: spec.value })
                                        ]
                                      },
                                      spec.fact
                                    )
                                  )) })
                                ] }),
                                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dmp-check", children: rowPending ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.StateDot, { state: "ongoing" }) : selected ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.IconCheckOutlineRegular, {}) : null })
                              ]
                            },
                            row.key
                          );
                        }) }, group.id))
                      }
                    ),
                    state.status === "ready" && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "dmp-empty", role: "status", children: t(providerFilter === RECENT_ID ? "empty.recent" : providerFilter !== null ? "empty.provider" : catalogRows.length === 0 ? "empty.models" : "search.empty") })
                  ]
                }
              ),
              document.body
            ),
            providerAt && (0, import_react_dom3.createPortal)(
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                ProviderMenu,
                {
                  anchorRef: providerChipRef,
                  panelRef: providerMenuRef,
                  idPrefix: id,
                  side: providerSide,
                  options: providerOptions,
                  current: providerFilter,
                  busy,
                  t,
                  onPick: (providerId) => {
                    setProviderFilter(providerId);
                    closeProviderMenu(true);
                  },
                  onClose: closeProviderMenu
                }
              ),
              document.body
            ),
            settingsAt && (0, import_react_dom3.createPortal)(
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                SettingsMenu,
                {
                  anchorRef: settingsButtonRef,
                  panelRef: settingsMenuRef,
                  idPrefix: id,
                  side: settingsSide,
                  directory,
                  params,
                  busy,
                  maxHeight: settingsBudget,
                  t,
                  onSelect: (selection) => {
                    submit(selection);
                  },
                  onClose: closeSettings
                }
              ),
              document.body
            ),
            toast !== null && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
              import_dsh_client_ui_primitives3.Toast,
              {
                text: toast.text,
                icon: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives3.IconWarningOutlineRegular, {}),
                anchor: rootRef.current?.closest("[data-composer-card]") ?? null,
                onDone: () => {
                  setToast(null);
                }
              },
              toast.seq
            )
          ]
        }
      );
    }
    
    // src/client/styles.ts
    var STYLE_ELEMENT_ID = "dsh-rabbit-model-picker-styles";
    var CSS = `
    .dmp-root {
      position: relative;
      display: flex;
      align-items: center;
      gap: 2px;
      min-width: 0;
    }
    
    /* Shared chip chrome: the model trigger and the provider chip read as one pair.
       They keep SEPARATE class names on purpose — sharing one name made the two
       controls indistinguishable to every selector, including tests and tooling.
       The settings gear joins the hover/focus/disabled contract but NOT this block:
       it is icon-only at every width, so it has no text to collapse. */
    .dmp-trigger,
    .dmp-provider {
      display: flex;
      align-items: center;
      gap: 4px;
      min-width: 0;
      max-width: 220px;
      max-width: min(360px, 45cqw);
      height: 28px;
      padding: 0 4px 0 8px;
      border: none;
      border-radius: var(--dsw-radius-sm);
      outline: none;
      background: transparent;
      color: var(--dsw-alias-label-secondary);
      font-size: 13px;
      line-height: 20px;
      font-weight: 400;
      cursor: pointer;
    }
    
    .dmp-trigger:hover:not(:disabled),
    .dmp-provider:hover:not(:disabled) {
      background: var(--dsw-alias-interactive-bg-hover);
    }
    
    .dmp-trigger:focus-visible:not([data-selection-focus]),
    .dmp-provider:focus-visible:not([data-selection-focus]) {
      box-shadow: 0 0 0 2px var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));
    }
    
    .dmp-trigger:disabled,
    .dmp-provider:disabled {
      color: var(--dsw-alias-label-dimmed);
      cursor: default;
    }
    
    /* The composer measures expanded row demand and owns this display variable;
       this seat only consumes it. Outside a composer the trigger keeps its text,
       and the icon stays hidden.
       The trigger labels the MODEL and nothing else: the effort in force is a
       parameter (the row's badge states it, the panel edits it) and repeating it
       beside the name only competes with the name for width. There is therefore no
       separator element to keep alive here — do not reintroduce one. */
    .dmp-trigger-label {
      display: var(--dsh-composer-model-text-display, block);
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .dmp-trigger-icon {
      display: var(--dsh-composer-model-icon-display, none);
      flex: 0 0 auto;
    }
    
    .dmp-chevron {
      flex: 0 0 auto;
      color: var(--dsw-alias-label-caption);
      transition: transform 120ms ease;
    }
    
    .dmp-chevron-open {
      transform: rotate(180deg);
    }
    
    /* The provider chip is the secondary control of the pair: narrower until it
       actually filters, when it tones up to the trigger's own ink. It is NOT
       demoted to the caption token, even unfiltered: this chip renders the word
       "全部", which is the control's whole label, and the caption ink measures
       2.08:1 on this card in the light theme. Declared after the shared block so
       these equal-specificity overrides win. */
    .dmp-provider {
      max-width: 100px;
      max-width: min(160px, 22cqw);
      color: var(--dsw-alias-label-secondary);
    }
    
    .dmp-provider[data-filtered] {
      color: var(--dsw-alias-label-primary);
    }
    
    .dmp-provider-open {
      background: var(--dsw-alias-interactive-bg-hover);
    }
    
    .dmp-provider-label {
      display: var(--dsh-composer-model-text-display, block);
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .dmp-provider-icon {
      display: var(--dsh-composer-model-icon-display, none);
      flex: 0 0 auto;
    }
    
    /* The parameter gear: the trigger pair's right-hand companion. Icon-only by
       design (it carries no model text), so the composer's narrow-row variables do
       not apply to it and a 28px square is all the width it ever asks for. */
    .dmp-settings-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      width: 28px;
      height: 28px;
      padding: 0;
      border: none;
      border-radius: var(--dsw-radius-sm);
      outline: none;
      background: transparent;
      color: var(--dsw-alias-label-caption);
      cursor: pointer;
    }
    
    .dmp-settings-button:hover:not(:disabled) {
      background: var(--dsw-alias-interactive-bg-hover);
      color: var(--dsw-alias-label-secondary);
    }
    
    .dmp-settings-button:focus-visible:not([data-selection-focus]) {
      box-shadow: 0 0 0 2px var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));
    }
    
    .dmp-settings-button:disabled {
      color: var(--dsw-alias-label-dimmed);
      cursor: default;
    }
    
    /* A route with a record tones the gear up; the open state is spelled by its own
       class so the two do not have to be told apart by specificity. */
    .dmp-settings-button[data-edited] {
      color: var(--dsw-alias-label-secondary);
    }
    
    .dmp-settings-open {
      background: var(--dsw-alias-interactive-bg-hover);
      color: var(--dsw-alias-label-primary);
    }
    
    /* Portaled to body and placed from the trigger rect, so the sidebar and the
       columns' overflow clips cannot crop the card. border-box keeps the OUTER
       width inside the design budget (padding included). */
    .dmp-menu {
      position: fixed;
      z-index: 1100;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      width: min(320px, calc(100vw - 32px));
      max-height: min(420px, calc(100vh - 96px));
      overflow: hidden;
      padding: 4px;
      border: 0;
      --dsw-elevation-stroke-color: var(--dsw-alias-border-l1);
      box-shadow: var(--dsw-elevation-prominent);
      color: var(--dsw-alias-label-primary);
      /* Elevated surface: the scrollbar thumb takes the l2 elevation tokens. */
      --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2);
      --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2);
    }
    
    /* Status and empty copy are sentences a user is meant to read ("正在刷新模型列表…",
       "没有匹配的模型。"), not chrome: the tertiary ink measured 3.61:1 on this card
       in the light theme, under AA for 12px text. Same ink as every other
       explanatory line. */
    .dmp-status,
    .dmp-empty {
      padding: 8px;
      color: var(--dsw-alias-label-secondary);
      font-size: 12px;
      line-height: 18px;
    }
    
    /* A load failure and a partial failure. The failure signal is the host's danger
       fill plus the icon, NOT the ink: the host's error token measures 4.38:1 light
       and 3.61:1 dark on this card, which is under AA for any of these sizes, and
       the only size at which that red becomes compliant is 24px — absurd for a
       one-line callout. So the sentence takes ordinary readable ink and the state is
       carried by the fill, the icon and the words themselves (the message says the
       load failed). An error that is red but unreadable is worse than one that is
       neutral but legible. */
    .dmp-error,
    .dmp-warning {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 6px;
      margin-bottom: 3px;
      padding: 6px 7px;
      border-radius: var(--dsw-radius-md);
      background: var(--dsw-alias-interactive-bg-hover-danger);
      color: var(--dsw-alias-label-secondary);
      font-size: 13px;
      line-height: 18px;
    }
    
    .dmp-error-icon {
      flex: 0 0 14px;
      margin-top: 1px;
      color: var(--dsw-alias-state-error-primary);
    }
    
    .dmp-warning {
      background: var(--dsw-alias-bg-module-platform);
    }
    
    .dmp-retry {
      flex: 0 0 auto;
      padding: 0;
      border: none;
      background: transparent;
      color: inherit;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    
    .dmp-search-row {
      position: relative;
      flex-shrink: 0;
      margin: 2px 0 3px;
    }
    
    .dmp-search-row .dmp-search {
      display: flex;
      height: auto;
      padding: 5px 7px;
      border: 0 solid transparent;
      border-radius: var(--dsw-radius-md);
      background: transparent;
    }
    
    .dmp-search-row .dmp-search-with-query {
      padding-right: 34px;
    }
    
    .dmp-search-row .dmp-search input {
      padding: 0;
      font-size: 12px;
      line-height: normal;
    }
    
    /* The search field's placeholder is the ONLY instruction the list gives
       ("搜索模型…"), so it is held to the same ink as body copy: the caption token
       measures 2.08:1 on the card in the light theme, which is not readable, and a
       placeholder a user cannot read is not a hint. */
    .dmp-search-row .dmp-search input::placeholder {
      color: var(--dsw-alias-label-secondary);
    }
    
    .dmp-search-row .dmp-search:focus-within {
      border-color: transparent;
    }
    
    .dmp-search-clear {
      position: absolute;
      top: 50%;
      right: 4px;
      transform: translateY(-50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      border: none;
      border-radius: 50%;
      corner-shape: round;
      background: transparent;
      color: var(--dsw-alias-label-secondary);
      cursor: pointer;
    }
    
    .dmp-search-clear:hover,
    .dmp-search-clear:focus-visible {
      outline: none;
      background: var(--dsw-alias-interactive-bg-hover);
    }
    
    .dmp-groups {
      min-height: 0;
      overflow-y: auto;
    }
    
    /* The primitive's group heading is position:sticky with a TRANSPARENT
       background: it is painted only once observeStickyMenuGroups marks it
       data-stuck, and that observation rides the rendering pipeline
       (IntersectionObserver + ResizeObserver), which does not run while the tab is
       in the background or the window is occluded. Measured there: none of the
       three observers ever fires, so a pinned heading sits over a row with both
       texts drawn through each other. The shipped seat has the same defect. Filling
       the heading unconditionally makes it cover its rows with no observer in the
       path; the token is the host's own choice for exactly this strip. */
    .dmp-groups [data-menu-group-heading] {
      background: var(--dsw-alias-menu-group-header-fill);
    }
    
    /* The model row states facts instead of offering controls, and it keeps them on
       ONE line: the name shrinks with an ellipsis while the badge strip keeps its
       own width, so a long catalog name never pushes the facts out of the row. It is
       a div rather than a button so a row can hold block content while aria-disabled
       keeps it focusable during a selection (a disabled button would drop the
       keyboard back to the trigger).
    
       The row is 38px tall: a 22px badge capsule plus 8px of air above and below is
       what makes the strip read as a fact line rather than as text that happens to
       have a background. The strip is kept on ONE line (flex-wrap: nowrap): a badge
       broken across two lines was the row at 46px, and a row that changes height
       because its facts wrapped is a list that jumps as the eye scans it. */
    .dmp-row {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 6px;
      width: auto;
      min-width: 100%;
      min-height: 38px;
      padding: 5px 7px;
      border: none;
      border-radius: var(--dsw-radius-md);
      outline: none;
      background: transparent;
      color: inherit;
      text-align: left;
      cursor: pointer;
    }
    
    /* The rows carry aria-disabled (the provider rows in the other card are real
       buttons and carry disabled); both spellings mean the same thing here. */
    .dmp-row:hover:not([aria-disabled='true']):not(:disabled),
    .dmp-row:focus-visible,
    .dmp-row[data-active]:not([aria-disabled='true']) {
      background: var(--dsw-alias-interactive-bg-hover);
    }
    
    .dmp-row[aria-disabled='true'],
    .dmp-row:disabled {
      color: var(--dsw-alias-label-dimmed);
      cursor: default;
    }
    
    /* Trailing model count on a provider row. The count is the reason to pick one
       provider over another, so it reads in the same ink as the row rather than in
       the caption token (2.08:1 on this card in the light theme). */
    .dmp-provider-count {
      flex: 0 0 auto;
      color: var(--dsw-alias-label-secondary);
      font-size: 11px;
      line-height: 16px;
      font-variant-numeric: tabular-nums;
    }
    
    /* "当前会话" on the provider row this conversation runs on. Same readable ink
       as the count (caption is 2.08:1 on this card) and the same 11px, so the two
       read as one trailing information column rather than the marker looking like
       part of the provider's name. It sits inside dmp-row-copy, whose name half
       is the elastic one — so the marker lands on the row's right edge, beside the
       count, and never squeezes the name into an earlier ellipsis than its
       neighbours get. */
    .dmp-provider-session {
      flex: 0 0 auto;
      color: var(--dsw-alias-label-secondary);
      font-size: 11px;
      line-height: 16px;
      white-space: nowrap;
    }
    
    /* The "加载失败" mark on a provider row — the only thing on that row explaining
       why it has no models. The host's warn amber measures 2.72:1 here in the light
       theme (4.26:1 in dark) and no amber token in this palette clears AA on this
       card, so the words take readable ink and the state is carried by a trailing
       red dot, which is decoration and owes no text ratio. */
    .dmp-provider-failed {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      flex: 0 0 auto;
      color: var(--dsw-alias-label-secondary);
      font-size: 12px;
      font-weight: 600;
      line-height: 16px;
    }
    
    .dmp-provider-failed-dot {
      flex: 0 0 6px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      corner-shape: round;
      background: var(--dsw-alias-state-error-primary);
    }
    
    /* "Only <provider> is shown" strip at the top of the model list. */
    .dmp-filter-hint {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      padding: 6px 8px 4px;
      /* This strip explains why the list is short and carries the way back to all
         providers, so it is copy rather than chrome: the tertiary ink measures
         3.61:1 on this card in the light theme, below AA for 12px text. */
      color: var(--dsw-alias-label-secondary);
      font-size: 12px;
      line-height: 18px;
    }
    
    .dmp-filter-clear {
      flex: 0 0 auto;
      padding: 0;
      border: none;
      background: transparent;
      color: var(--dsw-alias-label-secondary);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    
    .dmp-filter-clear:hover:not(:disabled) {
      color: var(--dsw-alias-label-primary);
    }
    
    /* Name first, facts behind it, both on the row's single line: the name is the
       flexible half, the strip is the fixed half. */
    .dmp-row-copy {
      display: flex;
      flex: 1;
      align-items: center;
      gap: 5px;
      min-width: 0;
    }
    
    .dmp-row-name {
      flex: 1 1 auto;
      /* The name is the row's elastic half: it takes whatever the four capsules do
         not need, and it is what ellipsizes when the composer is narrow. The 48px
         floor is not a width budget — it is the point below which a name stops
         identifying a model at all. */
      min-width: 48px;
      overflow: hidden;
      color: inherit;
      font-size: 13px;
      line-height: 18px;
      font-weight: 400;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    /* The fact strip: one badge per fact, in the host's Tag chrome. Nothing in here
       is a control — that is the point of the strip, so it takes no hover, no focus
       ring and no cursor.
    
       WIDTH IS THE SCARCE RESOURCE, so every capsule is built tight (see
       .dmp-badges .dmp-badge): the four common capsules measure ~151px together,
       where the first version of this strip measured ~212px and left the model name
       53px — barely two characters — in a 320px card. The strip is the row's fixed
       half (it keeps its own width) and the name absorbs the deficit and
       ellipsizes, which is why the name is what got the 69px back. */
    .dmp-badges {
      display: flex;
      flex: 0 0 auto;
      align-items: center;
      flex-wrap: nowrap;
      gap: 2px;
    }
    
    /* The badge is two cells on one baseline: the icon cell and the value.
       The primitive's own capsule is 1px 8px at 11px/17px, which both wastes 16px
       of width on a two-cell badge and leaves the icon floating in padding; these
       overrides make it a 22px-tall capsule whose horizontal padding is only the
       4px the capsule edge needs. min-height is stated rather than derived from the
       icon cell, so the capsule keeps its height while the cell stays exactly as
       wide as the glyph — a wide cell is pure width with nothing in it.
       Specificity beats the primitive's own .tag padding regardless of which
       stylesheet the shell injects first. */
    .dmp-badges .dmp-badge {
      gap: 3px;
      min-height: 22px;
      padding: 0 4px;
      font-weight: 400;
    }
    
    /* The icon cell: it states WHICH fact, so it is never the value's leftover, and
       it is the same size in every badge of the row whether the badge behind it
       carries text or not. It is exactly the glyph's box — the artwork carries its
       own inset inside the viewBox — so the cell adds no width the icon does not
       use. */
    .dmp-badge-fact {
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      width: 14px;
      height: 14px;
    }
    
    .dmp-badge-icon {
      display: block;
      flex: 0 0 auto;
      color: var(--dsw-alias-label-secondary);
    }
    
    .dmp-badge[data-tone='quiet'] .dmp-badge-icon {
      color: var(--dsw-alias-label-tertiary);
    }
    
    /* A capacity or a level name is a value, so it reads in tabular figures and one
       step brighter than the badge's own ink. The cap is what keeps an adapter's
       unusually long level name (the effort name is free adapter text) from growing
       the strip until the context-window badge — the last one — is pushed off the
       card and clipped by .dmp-menu's overflow. Beyond it the value ellipsizes like
       the name does. */
    .dmp-badge-value {
      max-width: 64px;
      overflow: hidden;
      color: var(--dsw-alias-label-secondary);
      font-variant-numeric: tabular-nums;
      text-overflow: ellipsis;
    }
    
    .dmp-check {
      display: grid;
      place-items: center;
      flex: 0 0 14px;
      color: var(--dsw-alias-label-primary);
    }
    
    .dmp-check svg {
      width: 14px;
      height: 14px;
    }
    
    /* The provider card reuses the model card's material and only narrows it. */
    .dmp-provider-menu {
      width: min(240px, calc(100vw - 32px));
      max-height: min(380px, calc(100vh - 96px));
    }
    
    /* The parameter panel: same material as the other two cards, wider than the
       provider card (it carries labelled controls, not just rows).
       The surface itself must NOT scroll. MenuSurface paints the card's fill as an
       absolutely positioned child (.material, inset: 0) anchored to this element's
       padding box, so a surface that scrolls drags that layer up with the content
       and the bottom of the card loses its fill — the page shows through the panel's
       own footer, and the layer's rounded bottom corners appear in the middle of the
       card. Measured on the real GUI: exactly that. The scroll role belongs to the
       inner body below; the model card already splits it the same way (.dmp-groups). */
    .dmp-settings {
      width: min(280px, calc(100vw - 32px));
      max-height: min(460px, calc(100vh - 96px));
      overflow: hidden;
    }
    
    /* The card holds initial focus when it opens (§5.10), so it needs a ring of its
       own: without one the focus is invisible until the first Tab, and with the UA's
       default outline it reads as a selection border around a floating card. Same
       token the capacity field paints on focus-within, so the two never disagree
       about which thing is focused. Mouse users never see it — focus-visible only
       matches the keyboard path that opened the panel. */
    .dmp-settings:focus-visible {
      outline: 1px solid var(--dsw-alias-state-business-primary);
      outline-offset: 1px;
    }
    
    /* The panel's scroll viewport: the head and the state line stay put, everything
       below them scrolls inside the card. min-height: 0 is what lets the flex item
       shrink below its content and actually become scrollable. */
    .dmp-settings-body {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
    }
    
    .dmp-settings-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      padding: 6px 8px 4px;
    }
    
    .dmp-settings-title {
      min-width: 0;
      overflow: hidden;
      color: var(--dsw-alias-label-primary);
      font-size: 13px;
      line-height: 18px;
      font-weight: 400;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .dmp-settings-reset {
      flex: 0 0 auto;
      padding: 0;
      border: none;
      background: transparent;
      color: var(--dsw-alias-label-secondary);
      font: inherit;
      font-size: 11px;
      line-height: 16px;
      font-weight: 600;
      cursor: pointer;
    }
    
    .dmp-settings-reset:hover:not(:disabled) {
      color: var(--dsw-alias-label-primary);
    }
    
    .dmp-settings-reset:disabled {
      color: var(--dsw-alias-label-dimmed);
      cursor: default;
    }
    
    .dmp-settings-section {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 6px 8px;
      border-top: 1px solid var(--dsw-alias-border-l1);
    }
    
    /* The parameter panel's labels and every explanatory line below them. These are
       real copy, not decoration, so they take the secondary ink: the caption token
       measures 2.08:1 on this card in the light theme (3.82:1 in dark), which fails
       WCAG AA for text this size in both themes — "已声明：文字、图片" is information
       the user needs in order to decide what the switches do. Hierarchy is carried
       by size (11px vs the 13px control text) instead of by an unreadable ink. */
    .dmp-settings-label {
      color: var(--dsw-alias-label-secondary);
      font-size: 11px;
      line-height: 16px;
      font-weight: 600;
    }
    
    .dmp-settings-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      min-height: 30px;
    }
    
    .dmp-settings-name {
      min-width: 0;
      color: var(--dsw-alias-label-secondary);
      font-size: 13px;
      line-height: 18px;
    }
    
    .dmp-settings-hint {
      color: var(--dsw-alias-label-secondary);
      font-size: 11px;
      line-height: 16px;
    }
    
    /* The panel's state line: why the controls above it are inert (no declaration,
       read-only profile, unavailable settings service). It is rendered above the
       controls it qualifies, so the reason is read before the control — which is
       exactly why it must be legible: it is the ONLY explanation of a disabled
       panel. Same ink as the hints. */
    .dmp-settings-notice {
      padding: 6px 8px;
      border-top: 1px solid var(--dsw-alias-border-l1);
      color: var(--dsw-alias-label-secondary);
      font-size: 11px;
      line-height: 16px;
    }
    
    /* What the settings service refused, in its own words — the one line a user MUST
       read, and the only statement that their edit did not happen.
       It would be natural to paint this in the host's error red, and that is what
       this rule did at first. It cannot: the red measures 4.38:1 on this card in the
       light theme and 3.61:1 on the composer card in dark, both under AA for any
       body size, and the only size where that red becomes compliant is 24px — which
       turns one short refusal into a banner that dwarfs the 11-13px panel it lives
       in and pushes the controls down. So the failure is carried by things that do
       not have to be legible to be read: the host's danger fill, a warning icon in
       the error ink, and a sentence that says "被拒绝" in words. The copy becomes
       MORE legible than the red version (5.64:1 light / 7.86:1 dark), not less. */
    .dmp-settings-alert {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      padding: 6px 8px;
      border-top: 1px solid var(--dsw-alias-border-l1);
      background: var(--dsw-alias-interactive-bg-hover-danger);
      color: var(--dsw-alias-label-secondary);
      font-size: 11px;
      line-height: 16px;
    }
    
    .dmp-settings-alert-icon {
      flex: 0 0 12px;
      margin-top: 2px;
      color: var(--dsw-alias-state-error-primary);
    }
    
    /* The declaration this panel writes, so a reviewer can check the edit landed;
       the full namespace + path stays available in the title attribute. It is the
       quietest line of the panel but it is still information ("which declaration
       does this edit?"), so it uses the same secondary ink as every other line
       rather than the dimmed token — dimmed measures 1.23:1 on this card in the
       light theme, which is invisible rather than quiet. */
    .dmp-settings-target {
      overflow: hidden;
      padding: 4px 8px 6px;
      border-top: 1px solid var(--dsw-alias-border-l1);
      color: var(--dsw-alias-label-secondary);
      font-size: 10px;
      line-height: 14px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    /* The primitive owns the switch's own chrome; only its place in the row is ours.
       align-self keeps it centered instead of stretching to the row's 30px. */
    .dmp-settings-switch {
      flex: 0 0 auto;
      align-self: center;
    }
    
    /* The gear's own mark: it must never shrink in a cramped composer row. */
    .dmp-settings-icon {
      flex: 0 0 auto;
    }
    
    /* The effort choices of the parameter panel: the panel is the one surface that
       lets effort be changed, so these are the only effort controls left in the
       seat. This wrapper stacks them and keeps the group tight against its label. */
    .dmp-effort-list {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    
    /* The capacity field takes the row's remaining width; the primitive's wrapper
       and its native input are both stretched so the whole row is the target. */
    .dmp-settings-input {
      flex: 1;
      min-width: 0;
      height: 28px;
      padding: 0 6px;
      border: 1px solid var(--dsw-alias-border-l1);
      border-radius: var(--dsw-radius-md);
      background: transparent;
    }
    
    .dmp-settings-input:focus-within {
      border-color: var(--dsw-alias-state-business-primary);
    }
    
    .dmp-settings-input input {
      width: 100%;
      padding: 0;
      color: var(--dsw-alias-label-primary);
      font-size: 12px;
      font-variant-numeric: tabular-nums;
    }
    
    .dmp-settings-input input::placeholder {
      color: var(--dsw-alias-label-secondary);
    }
    
    .dmp-settings-input-bad {
      border-color: var(--dsw-alias-state-error-primary);
    }
    
    /* What the panel writes and where the edits land. This is the one paragraph in
       the card with no control of its own, and it is the only place the panel says
       its edits are real rather than a local override — so it is held at the same
       secondary ink as every other explanatory line instead of the caption token
       (2.08:1 on this card in the light theme). */
    .dmp-settings-note {
      display: flex;
      align-items: flex-start;
      gap: 5px;
      padding: 6px 8px;
      border-top: 1px solid var(--dsw-alias-border-l1);
      color: var(--dsw-alias-label-secondary);
      font-size: 11px;
      line-height: 16px;
    }
    
    .dmp-settings-note-icon {
      flex: 0 0 12px;
      margin-top: 2px;
    }
    
    .dmp-effort-item {
      display: flex;
      align-items: center;
      gap: 6px;
      width: 100%;
      min-height: 30px;
      padding: 4px 8px;
      border: none;
      border-radius: var(--dsw-radius-md);
      outline: none;
      background: transparent;
      color: inherit;
      font-size: 13px;
      line-height: 18px;
      text-align: left;
      cursor: pointer;
    }
    
    .dmp-effort-item:hover:not(:disabled),
    .dmp-effort-item:focus-visible {
      background: var(--dsw-alias-interactive-bg-hover);
    }
    
    .dmp-effort-item:disabled {
      color: var(--dsw-alias-label-dimmed);
      cursor: default;
    }
    
    .dmp-effort-name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .dmp-effort-check {
      display: grid;
      place-items: center;
      flex: 0 0 14px;
      color: var(--dsw-alias-label-primary);
    }
    
    .dmp-effort-check svg {
      width: 14px;
      height: 14px;
    }
    
    @media (max-width: 480px) {
      .dmp-menu {
        width: calc(100vw - 24px);
      }
    
      .dmp-provider-menu {
        width: calc(100vw - 24px);
      }
    
      .dmp-settings {
        width: calc(100vw - 24px);
      }
    }
    
    @media (prefers-reduced-motion: reduce) {
      .dmp-chevron {
        transition: none;
      }
    }
    `;
    function injectStyles() {
      if (typeof document === "undefined") return () => {
      };
      document.getElementById(STYLE_ELEMENT_ID)?.remove();
      const element = document.createElement("style");
      element.id = STYLE_ELEMENT_ID;
      element.textContent = CSS;
      document.head.append(element);
      return () => {
        if (element.isConnected) element.remove();
      };
    }
    
    // src/client/index.ts
    var inject = ["slots", "sessions", "modelDirectories", "remote", "remote.session"];
    function settingsFaceOf(scope) {
      const settings = scope.get("remote.settings");
      const llm = scope.get("remote.llm");
      if (typeof settings?.describe !== "function" || typeof settings.mutate !== "function") return null;
      if (typeof llm?.listConfigurableProviders !== "function") return null;
      return { settings, llm };
    }
    function apply(ctx) {
      const locale = ctx.get("locale");
      const translate = locale === void 0 ? localTranslate() : locale.bind(NS);
      if (locale !== void 0) {
        ctx.effect(() => locale.register(NS, dictionaries), "dsh-rabbit-model-picker: dictionaries");
      }
      ctx.effect(() => injectStyles(), "dsh-rabbit-model-picker: styles");
      ctx.effect(() => retireLegacyProviderFilter(), "dsh-rabbit-model-picker: legacy prefs");
      ctx.inject(["slots", "sessions", "modelDirectories", "remote", "remote.session"], (scope) => {
        const models = scope.modelDirectories;
        const sessions = scope.sessions;
        const params = new ParamsStore(settingsFaceOf(scope));
        scope.slots.inject("conversation.input.model", () => scope.slots.register({
          name: "conversation.input.model",
          // Ascending rank, lowest renders: -10 shadows the shipped seat at 0.
          priority: -10,
          // Declaring the namespace puts the framework `t` seat on the component;
          // without a locale face the inject face carries the local translator.
          ...locale === void 0 ? {} : { locale: NS },
          inject: (sessionId) => {
            const directory = models.directoryFor(sessionId);
            const available = sessions.subagentAddress(sessionId) === void 0;
            return {
              available,
              sessionId,
              directory: directory.store,
              params,
              translate,
              load: () => {
                if (available) directory.load().catch(() => {
                });
              },
              select: (selection) => available ? directory.select(selection) : Promise.resolve(void 0)
            };
          }
        }, Picker));
      });
    }
    
    return module.exports;
  },
});

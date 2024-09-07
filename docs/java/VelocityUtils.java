    /**
     * 获取模板信息
     *
     * @return 模板列表
     */
    public static List<String> getTemplateList(String tplCategory) {
        List<String> templates = new ArrayList<>();
        templates.add("vm/java/domain.java.vm");
        templates.add("vm/java/vo.java.vm");
        templates.add("vm/java/bo.java.vm");
        templates.add("vm/java/mapper.java.vm");
        templates.add("vm/java/service.java.vm");
        templates.add("vm/java/serviceImpl.java.vm");
        templates.add("vm/java/controller.java.vm");
        templates.add("vm/xml/mapper.xml.vm");
        if (DataBaseHelper.isOracle()) {
            templates.add("vm/sql/oracle/sql.vm");
        } else if (DataBaseHelper.isPostgerSql()) {
            templates.add("vm/sql/postgres/sql.vm");
        } else if (DataBaseHelper.isSqlServer()) {
            templates.add("vm/sql/sqlserver/sql.vm");
        } else {
            templates.add("vm/sql/sql.vm");
        }
        templates.add("vm/ts/api.ts.vm");
        templates.add("vm/ts/types.ts.vm");
        templates.add("vm/soybean/typings/soy.api.d.ts.vm");
        templates.add("vm/soybean/api/soy.api.ts.vm");
        if (GenConstants.TPL_CRUD.equals(tplCategory)) {
            templates.add("vm/vue/index.vue.vm");
            templates.add("vm/soybean/soy.index.vue.vm");
        } else if (GenConstants.TPL_TREE.equals(tplCategory)) {
            templates.add("vm/vue/index-tree.vue.vm");
        }
        return templates;
    }

    /**
     * 获取文件名
     */
    public static String getFileName(String template, GenTable genTable) {
        // 文件名称
        String fileName = "";
        // 包路径
        String packageName = genTable.getPackageName();
        // 模块名
        String moduleName = genTable.getModuleName();
        // 大写类名
        String className = genTable.getClassName();
        // 业务名称
        String businessName = genTable.getBusinessName();

        String javaPath = PROJECT_PATH + "/" + StringUtils.replace(packageName, ".", "/");
        String mybatisPath = MYBATIS_PATH + "/" + moduleName;
        String vuePath = "vue";

        if (template.contains("domain.java.vm")) {
            fileName = StringUtils.format("{}/domain/{}.java", javaPath, className);
        }
        if (template.contains("vo.java.vm")) {
            fileName = StringUtils.format("{}/domain/vo/{}Vo.java", javaPath, className);
        }
        if (template.contains("bo.java.vm")) {
            fileName = StringUtils.format("{}/domain/bo/{}Bo.java", javaPath, className);
        }
        if (template.contains("soy.index.vue.vm")) {
            fileName = StringUtils.format("soybean/views/{}/{}/index.vue", moduleName, businessName);
        } else if (template.contains("soy.api.d.ts.vm")) {
            fileName = StringUtils.format("soybean/typings/api/{}.d.ts", moduleName);
        } else if (template.contains("soy.api.ts.vm")) {
            fileName = StringUtils.format("soybean/api/{}/{}.ts", moduleName, businessName);
        } else if (template.contains("mapper.java.vm")) {
            fileName = StringUtils.format("{}/mapper/{}Mapper.java", javaPath, className);
        } else if (template.contains("service.java.vm")) {
            fileName = StringUtils.format("{}/service/I{}Service.java", javaPath, className);
        } else if (template.contains("serviceImpl.java.vm")) {
            fileName = StringUtils.format("{}/service/impl/{}ServiceImpl.java", javaPath, className);
        } else if (template.contains("controller.java.vm")) {
            fileName = StringUtils.format("{}/controller/{}Controller.java", javaPath, className);
        } else if (template.contains("mapper.xml.vm")) {
            fileName = StringUtils.format("{}/{}Mapper.xml", mybatisPath, className);
        } else if (template.contains("sql.vm")) {
            fileName = businessName + "Menu.sql";
        } else if (template.contains("api.ts.vm")) {
            fileName = StringUtils.format("{}/api/{}/{}/index.ts", vuePath, moduleName, businessName);
        } else if (template.contains("types.ts.vm")) {
            fileName = StringUtils.format("{}/api/{}/{}/types.ts", vuePath, moduleName, businessName);
        } else if (template.contains("index.vue.vm")) {
            fileName = StringUtils.format("{}/views/{}/{}/index.vue", vuePath, moduleName, businessName);
        } else if (template.contains("index-tree.vue.vm")) {
            fileName = StringUtils.format("{}/views/{}/{}/index.vue", vuePath, moduleName, businessName);
        }
        return fileName;
    }

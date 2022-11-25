let config = {
    dev: "",
    pro: ""
};
const baseUrl = process.env.NODE_ENV == "development" ? config.dev : config.pro;
export default baseUrl;
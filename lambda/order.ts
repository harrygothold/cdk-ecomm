import createResponse from "./utils/createResponse";

exports.handler = async function () {
    return createResponse('This works');
};
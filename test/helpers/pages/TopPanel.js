'use strict';
/* jshint ignore:start */
const TopPanel = function() {
    const openBlockPage = element(by.xpath("//a[@href='blocks']"));
    const openStatusPage = element(by.xpath("//a[@href='status']"));
    const search = element(by.id('search'));


    this.search = function(text) {
        search.sendKeys(text);
        search.submit();
    };

    this.openBlockPage = function() {
        openBlockPage.click();
    };

    this.openStatusPage = function() {
        openStatusPage.click();
    };

};
module.exports = new TopPanel();

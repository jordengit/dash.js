import DashManifestModel from '../src/dash/models/DashManifestModel.js';
import BaseURL from '../src/dash/vo/BaseURL.js';

const expect = require('chai').expect;

const context = {};
const dashManifestModel = DashManifestModel(context).getInstance();

const TEST_URL = 'http://www.example.com/';
const SERVICE_LOCATION = 'testServiceLocation';

describe('DashManifestModel', function () {

    it('should return true when getIsDVB is called and manifest contains a valid DVB profile', () => {
        const manifest = {
            profiles: 'urn:dvb:dash:profile:dvb-dash:2014,urn:dvb:dash:profile:dvb-dash:isoff-ext-live:2014'
        };

        const isDVB = dashManifestModel.getIsDVB(manifest);

        expect(isDVB).to.be.true; // jshint ignore:line
    });

    it('should return false when getIsDVB is called and manifest does not contain a valid DVB profile', () => {
        const manifest = {
            profiles: 'urn:mpeg:dash:profile:isoff-on-demand:2011, http://dashif.org/guildelines/dash264'
        };

        const isDVB = dashManifestModel.getIsDVB(manifest);

        expect(isDVB).to.be.false; // jshint ignore:line
    });

    it('should return true when getIsOnDemand is called and manifest contains the on-demand profile', () => {
        const manifest = {
            profiles: 'urn:dvb:dash:profile:dvb-dash:2014,urn:mpeg:dash:profile:isoff-on-demand:2011'
        };

        const isOnDemand = dashManifestModel.getIsOnDemand(manifest);

        expect(isOnDemand).to.be.true; // jshint ignore:line
    });

    it('returns an empty Array when no BaseURLs or baseUri are present on a node', () => {
        const node = {};

        const obj = dashManifestModel.getBaseURLsFromElement(node);

        expect(obj).to.be.instanceOf(Array);    // jshint ignore:line
        expect(obj).to.be.empty;                // jshint ignore:line

    });

    it('returns an Array of BaseURLs when no BaseURLs are present on a node, but there is a baseUri', () => {
        const node = {
            baseUri: TEST_URL
        };

        const obj = dashManifestModel.getBaseURLsFromElement(node);

        expect(obj).to.be.instanceOf(Array);        // jshint ignore:line
        expect(obj).to.have.lengthOf(1);            // jshint ignore:line
        expect(obj[0]).to.be.instanceOf(BaseURL);   // jshint ignore:line
        expect(obj[0].url).to.equal(TEST_URL);      // jshint ignore:line
    });

    it('returns an Array of BaseURLs with BaseURL[0] serviceLocation set to URL when no serviceLocation was specified', () => {
        const node = {
            BaseURL_asArray: [{
                __text: TEST_URL
            }]
        };

        const obj = dashManifestModel.getBaseURLsFromElement(node);

        expect(obj).to.be.instanceOf(Array);                // jshint ignore:line
        expect(obj).to.have.lengthOf(1);                    // jshint ignore:line
        expect(obj[0]).to.be.instanceOf(BaseURL);           // jshint ignore:line
        expect(obj[0].url).to.equal(TEST_URL);              // jshint ignore:line
        expect(obj[0].serviceLocation).to.equal(TEST_URL);  // jshint ignore:line
    });

    it('returns an Array of BaseURLs when multiple BaseUrls were specified', () => {
        const node = {
            BaseURL_asArray: [
                {
                    __text: TEST_URL + '0'
                },
                {
                    __text: TEST_URL + '1'
                }
            ]
        };

        const obj = dashManifestModel.getBaseURLsFromElement(node);

        expect(obj).to.be.instanceOf(Array);        // jshint ignore:line
        expect(obj).to.have.lengthOf(2);            // jshint ignore:line
        obj.forEach((o, i) => {
            expect(o).to.be.instanceOf(BaseURL);    // jshint ignore:line
            expect(o.url).to.equal(TEST_URL + i);   // jshint ignore:line
        });
    });

    it('returns an Array of BaseURLs with BaseURL[0] serviceLocation set when serviceLocation was specified', () => {
        const node = {
            BaseURL_asArray: [{
                __text: TEST_URL,
                serviceLocation: SERVICE_LOCATION
            }]
        };

        const obj = dashManifestModel.getBaseURLsFromElement(node);

        expect(obj).to.be.instanceOf(Array);                        // jshint ignore:line
        expect(obj).to.have.lengthOf(1);                            // jshint ignore:line
        expect(obj[0]).to.be.instanceOf(BaseURL);                   // jshint ignore:line
        expect(obj[0].url).to.equal(TEST_URL);                      // jshint ignore:line
        expect(obj[0].serviceLocation).to.equal(SERVICE_LOCATION);  // jshint ignore:line
    });

    it('returns an Array of BaseURLs with BaseURL[0] having correct defaults for DVB extensions when not specified', () => {
        const node = {
            BaseURL_asArray: [{
                __text: TEST_URL
            }]
        };

        const obj = dashManifestModel.getBaseURLsFromElement(node);

        expect(obj).to.be.instanceOf(Array);                                // jshint ignore:line
        expect(obj).to.have.lengthOf(1);                                    // jshint ignore:line
        expect(obj[0].dvb_priority).to.equal(BaseURL.DEFAULT_DVB_PRIORITY); // jshint ignore:line
        expect(obj[0].dvb_weight).to.equal(BaseURL.DEFAULT_DVB_WEIGHT);     // jshint ignore:line
    });
});

const path = require('path');
const { BROWSERS_CONFIG_NAME, readTargetsFromConfig } = require('../env-bundles');

jest.mock('fs');

describe('env-bundles', () => {
    const MOCK_FILES = {
        [path.join(process.cwd(), BROWSERS_CONFIG_NAME)]: '["Chrome 65"]'
    };

    beforeEach(() => {
        require('fs').__setMockFiles(MOCK_FILES);
    });

    it('should correctly read targets from config', () => {
        const targets = readTargetsFromConfig();

        expect(targets[0]).toEqual('Chrome 65');
    });

    it('should correctly read targets from config', () => {
        expect(() => readTargetsFromConfig('./someFile.json')).toThrow();
    });
});

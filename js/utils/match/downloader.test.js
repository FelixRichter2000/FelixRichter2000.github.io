const Downloader = require("./downloader");

let mockCreateElement = jest.fn();
let mockAppendChild = jest.fn();
let mockRemoveChild = jest.fn();
let mockSetAttribute = jest.fn();
let mockClick = jest.fn();
let mockStyle = {};
mockCreateElement.mockImplementation(() => ({ setAttribute: mockSetAttribute, click: mockClick, style: mockStyle }));
document.createElement = mockCreateElement;
document.body.appendChild = mockAppendChild;
document.body.removeChild = mockRemoveChild;

afterEach(() => {
    jest.clearAllMocks();
});

describe('test downloader', () => {
    test('create Downloader', () => {
        new Downloader();
    });
    test('call download_to_client with filename and string content', () => {
        let downloader = new Downloader();
        downloader.filename = 'filename';
        downloader.content = 'content';
        downloader.download_to_client();
        expect(mockCreateElement).toHaveBeenCalledWith('a');
        expect(mockSetAttribute).toHaveBeenCalledWith('href', 'data:text\/plain;charset=utf-8,content');
        expect(mockSetAttribute).toHaveBeenCalledWith('download', 'filename');
        expect(mockStyle.display).toBe('none');
        expect(mockAppendChild).toHaveBeenCalledWith({ click: expect.any(Function), setAttribute: expect.any(Function), style: { display: 'none' } });
        expect(mockRemoveChild).toHaveBeenCalledWith({ click: expect.any(Function), setAttribute: expect.any(Function), style: { display: 'none' } });
    });

    test('don`t do anything when filename is not set yet', () => {
        let downloader = new Downloader();
        downloader.content = 'content';
        downloader.download_to_client();
        expect(mockCreateElement).not.toHaveBeenCalled();
        expect(mockSetAttribute).not.toHaveBeenCalled();
        expect(mockAppendChild).not.toHaveBeenCalled();
        expect(mockRemoveChild).not.toHaveBeenCalled();
    });

    test('don`t do anything when content is not set yet', () => {
        let downloader = new Downloader();
        downloader.filename = 'filename';
        downloader.download_to_client();
        expect(mockCreateElement).not.toHaveBeenCalled();
        expect(mockSetAttribute).not.toHaveBeenCalled();
        expect(mockAppendChild).not.toHaveBeenCalled();
        expect(mockRemoveChild).not.toHaveBeenCalled();
    });

    test('don`t do anything when both filename and content are not set yet', () => {
        let downloader = new Downloader();
        downloader.download_to_client();
        expect(mockCreateElement).not.toHaveBeenCalled();
        expect(mockSetAttribute).not.toHaveBeenCalled();
        expect(mockAppendChild).not.toHaveBeenCalled();
        expect(mockRemoveChild).not.toHaveBeenCalled();
    });
});
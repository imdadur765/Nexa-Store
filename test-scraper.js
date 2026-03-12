import gplay from 'google-play-scraper';

async function test() {
    try {
        const data = await gplay.app({ appId: 'com.whatsapp' });
        console.log('Size:', data.size);
    } catch (e) {
        console.error(e);
    }
}

test();

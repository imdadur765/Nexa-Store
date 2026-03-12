async function test() {
    const pkg = 'com.whatsapp';
    const apiUrl = `https://ws75.aptoide.com/api/7/app/get/package_name=${pkg}`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const fileData = data.nodes?.meta?.data?.file;
        console.log('File Data:', JSON.stringify(fileData, null, 2));
    } catch (e) {
        console.error(e);
    }
}

test();

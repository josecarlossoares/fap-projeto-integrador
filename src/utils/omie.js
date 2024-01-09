module.exports = {
    omieImports: async function(){
        const omieAPIURL = 'https://app.omie.com.br/api/v1/geral/projetos/';
        const appKey = '38333295000';
        const appSecret = 'fed2163e2e8dccb53ff914ce9e2f1258';

        const requestData = {
        call: 'ListarProjetos',
        app_key: appKey,
        app_secret: appSecret,
        param: [{ pagina: 1, registros_por_pagina: 50, apenas_importado_api: 'N' }],
        };

        const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        };

        fetch(omieAPIURL, requestOptions)
        .then((response) => {
            if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log('Response from Omie API:', data);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    }
}

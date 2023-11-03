const http = require('http')
const fs = require('fs')
const servicesProd = fs.readFileSync('servicesProd.json')
const servicesStg = fs.readFileSync('servicesStg.json')
const servicesQA = fs.readFileSync('servicesQA.json')
const servicesDev = fs.readFileSync('servicesDev.json')
const settings = JSON.parse(fs.readFileSync('settings.json'))
const purecss = fs.readFileSync('./public/pure.css', 'utf8')
const favicon = fs.readFileSync('./public/favicon.ico')
const html = require('./lib/htmlhelperV2')

function addStatusTags(svcConfigArray) {
    let returnArray = svcConfigArray.slice()
    return returnArray.map(entry => {
        entry["statusCode"] = -1
        entry["statusTimestamp"] = new Date()
        return entry
    })
}

function fullURL(serviceEntry) {
    return `http://${serviceEntry.httpOptions.hostname == 'localhost' ? settings.myIp : serviceEntry.httpOptions.hostname}:${serviceEntry.httpOptions.port || 80}${serviceEntry.httpOptions.path}`
}

let services = addStatusTags(JSON.parse(servicesProd))
let services2 = addStatusTags(JSON.parse(servicesStg))
let services3 = addStatusTags(JSON.parse(servicesQA));
let services4 = addStatusTags(JSON.parse(servicesDev));

function makeRequest(serviceEntry) {
    var req = http.request(serviceEntry.httpOptions, function (res) {
        var responseBody = ''

        res.on("data", function (chunk) {
            responseBody += chunk.toString()
        })

        res.on("end", function () {
            serviceEntry.statusTimestamp = new Date()
            serviceEntry.responseBody = responseBody
            serviceEntry.statusCode = res.statusCode
        })
    })
    if (serviceEntry.requestBody) req.write(JSON.stringify(serviceEntry.requestBody))
    req.end()

    req.on("error", err => {
        console.log(err.message)
        serviceEntry.statusCode = -1
        serviceEntry.responseBody = err.message
    })
}

function refreshStatuses() {
    services.forEach(entry => {
        makeRequest(entry)
    })
}

function EnvColor(env) {
    if (env == 'PROD')
        return '#00ffbf'
    if (env == 'QA')
        return '#996666'
    if (env == 'STAGING')
        return '#ffff80'
    if (env == 'DEV')
        return '#ccccb3'
    return '#8080ff'
}

refreshStatuses()

setInterval(() => { refreshStatuses() }, settings.statusRefreshIntervalMs || 300000)

function genServiceStatusTable(servicesArray) {
    let tableRows = ''
    servicesArray.forEach(serviceEntry => {
        tableRows += html.element('tr',
            html.element('td', serviceEntry.environment, { style: `text-align:center; background-color:${EnvColor(serviceEntry.environment)};` }) +
            html.element('td', serviceEntry.name) +
            html.element('td', serviceEntry.statusCode, { style: `text-align:center;${serviceEntry.statusCode == 200 ? "background-color:#7fe296;" : "background-color:#ff9b9b;"}` }) +
            html.element('td', new Date().getTime() - serviceEntry.statusTimestamp.getTime()) +
            html.element('td', html.element('a', fullURL(serviceEntry), { href: fullURL(serviceEntry), target: '_blank' })) +
            html.element('td', html.element('a', serviceEntry.statusCode != 200 ? serviceEntry.responseBody : "SUCCESS"))
        )
    })
    return html.element('table',
        html.element('thead',
            html.element('tr',
                html.element('th', "Application") +
                html.element('th', "Service Name") +
                html.element('th', "Status Code") +
                html.element('th', "Updated (X ms ago)") +
                html.element('th', "URL") +
                html.element('th', "Response Body")
            )
        ) +
        html.element('tbody', tableRows), { class: "pure-table pure-table-bordered" })
}


// rest of the new stuff 
function genNavBar() {
    return html.element('div',
        html.element('a', 'PROD', { href: '/', class: 'nav-item' }) +
        html.element('a', 'STAGING', { href: '/servicesStg', class: 'nav-item' }) +
        html.element('a', 'QA', { href: '/servicesQA', class: 'nav-item' }) +
        html.element('a', 'DEV', { href: '/servicesDev', class: 'nav-item' }),
        { class: 'navbar' }
    );
}



http.createServer((req, res) => {


    console.log('Request Received');
    switch (req.url) {
        case '/favicon.ico':
            res.setHeader('Content-Type', 'image/x-icon');
            res.end(favicon);
            break;
        case '/data':
            res.end(JSON.stringify(services, null, 4));
            break;
        case '/servicesStg':
            res.end(html.Html(
                html.Head(html.Style(purecss)) +
                html.Title("servicesStg") +
                html.Body(genNavBar() + genServiceStatusTable(services2))
            ));
            break;
        case '/servicesQA':
            res.end(html.Html(
                html.Head(html.Style(purecss)) +
                html.Title("servicesQA") +
                html.Body(genNavBar() + genServiceStatusTable(services3))
            ));
            break;
        case '/servicesDev':
            res.end(html.Html(
                html.Head(html.Style(purecss)) +
                html.Title("servicesDev") +
                html.Body(genNavBar() + genServiceStatusTable(services4))
            ));
            break;
        default:
            res.end(html.Html(
                html.Head(html.Style(purecss)) +
                html.Title("servicesProd") +
                html.Body(genNavBar() + genServiceStatusTable(services))
            ));
    }
}).listen(settings.httpPort, () => {
    console.log(`Server running on host http://localhost:${settings.httpPort}`);
});














function filterTable() {
    var selectBox = document.getElementById('appFilter');
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    var table = document.getElementById('serviceTable');
    var tr = table.getElementsByTagName('tr');

    for (var i = 0; i < tr.length; i++) {
        var td = tr[i].getElementsByTagName('td')[0];
        if (td) {
            var appValue = td.textContent || td.innerText;
            if (selectedValue === 'all' || appValue.toUpperCase().includes(selectedValue.toUpperCase())) {
                tr[i].style.display = '';
            } else {
                tr[i].style.display = 'none';
            }
        }
    }
}









const http = require('http');
const fs = require('fs');
const servicesProd = fs.readFileSync('servicesProd.json');
const servicesStg = fs.readFileSync('servicesStg.json');
const servicesQA = fs.readFileSync('servicesQA.json');
const servicesDev = fs.readFileSync('servicesDev.json');
const settings = JSON.parse(fs.readFileSync('settings.json'));
const purecss = fs.readFileSync('./public/pure.css', 'utf8');
const favicon = fs.readFileSync('./public/favicon.ico');
const html = require('./lib/htmlhelperV2');

// ... (all your previous functions like addStatusTags, fullURL, makeRequest, etc.)

function filterServicesByApplication(servicesArray, applicationType) {
    return servicesArray.filter(service => service.application === applicationType);
}

// ... (rest of your existing functions)

// Update genServiceStatusTable to accept an application type for filtering
function genServiceStatusTable(servicesArray, applicationType) {
    let filteredServices = applicationType ? filterServicesByApplication(servicesArray, applicationType) : servicesArray;
    
    // ... (rest of your genServiceStatusTable logic)
}

// ... (rest of your code)

http.createServer((req, res) => {
    // ... (existing switch cases)

    // New route for filtering by application type
    case '/filter':
        // Extract the application type from the query parameter
        const urlParts = req.url.split('?');
        const queryParams = new URLSearchParams(urlParts[1]);
        const applicationType = queryParams.get('app'); // 'act' or 'acs'

        res.end(html.Html(
            html.Head(html.Style(purecss)) +
            html.Title("Filtered Services") +
            html.Body(genNavBar() + genServiceStatusTable(services, applicationType))
        ));
        break;

    // ... (rest of your switch cases)
}).listen(settings.httpPort, () => {
    console.log(`Server running on host http://localhost:${settings.httpPort}`);
});

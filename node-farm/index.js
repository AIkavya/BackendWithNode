const fs = require('fs');
const http = require('http');
const url = require('url');
const PORT = 3002;
const tempOverview = fs.readFileSync('./templates/temp_overview.html', 'utf-8');
const overview = fs.readFileSync('./templates/overview.html', 'utf-8');
const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
const productView = fs.readFileSync('./templates/product.html', 'utf-8');

function replaceContent(template, product)
{
  
  let output = template.replace(/{%Product_id%}/g, product.id);

  output = output.replace(/{%Product_Name%}/g, product.productName);
  output = output.replace(/{%Product_Image%}/g, product.image);
  output = output.replace(/{%Product_Quantity%}/g, product.quantity);
  output = output.replace(/{%Product_Price%}/g, product.price);
  output = output.replace(/{%Prodcut_Origin%}/g, product.from);
  output = output.replace(/{%Product_nutrients%}/g, product.nutrients);
  output = output.replace(/{%Product_Info%}/g, product.description);
    

  // Organic fix
  if (!product.organic) {
    output = output.replace(/{%Oraganic_Tag%}/g, 'not-organic');
  } else {
    output = output.replace(/{%Oraganic_Tag%}/g, '');
  }

  return output;
};
    

// console.log(data)

// convert to json ..

const dataObj = JSON.parse(data);

// console.log(dataObj)
// console.log(tempOverview);



const server = http.createServer((req, res) =>
{
    const urll = url.parse(req.url, true);
    const { query, pathname,hash } = urll;
    
    if (pathname === '/' || pathname === '/overview'  || pathname === 'https://aikavya.github.io/BackendWithNode/node-farm/')
    {
        res.writeHead(200, { "content-type": 'text/html'});
        let arrHtml = dataObj.map((el) => replaceContent(tempOverview, el))
        let tempCard = arrHtml.join('');
        const output = overview.replace('{%Product_Card%}', tempCard);
        res.end(output);
        
    }
    else if (pathname === '/product')
    {
        res.writeHead(200, { "content-type": 'text/html'});
        const product = dataObj[query.id];
        console.log(urll)
        const output = replaceContent(productView, product);
        res.end(output);
        
    }
    else if (pathname=== '/product') {
        res.writeHead(200, { "content-type": 'text/html'});
        let arrHtml = dataObj.map((el) => replaceContent(tempOverview, el))
        let tempCard = arrHtml.join('');
        const output = overview.replace('{%Product_Card%}', tempCard);
        res.end(output);
    }
    else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        })
        res.end(`<h1>Page Not Found</h1>`)
    }
}).listen(PORT);


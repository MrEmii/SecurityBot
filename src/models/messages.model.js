export default (user, reason, date) => {
    return `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=500px, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300&display=swap" rel="stylesheet">
        <title>Document</title>
    </head>
    <style>
        .main {
            background-image: linear-gradient(to right top, #f35178, #ea4971, #e1406a, #d93764, #d02d5d, #ca2758, #c42054, #be184f, #b9134b, #b40d47, #b00744, #ab0040);
            width: 100%;
            height: 250px;
            border-radius: 8px;
            position: relative;
            display: flex;
            justify-items: center;
            justify-content: center;
            flex-direction: column;
            font-family: 'Rubik', sans-serif;
            padding: 4%;
        }

        .header {
            width: 100%;
            margin: auto;
            display: flex;
            justify-content: center;
            flex-direction: column-reverse;
        }

        .header img {
            width: 100px;
            border-radius: 100%;
            margin: auto;
            margin-bottom: 10px;
        }

        .header .username {
            margin: auto;
            font-size: 36px;
            color: white;
            text-shadow: 2px 3px 0px #898999;
            line-height: 1.2;
            font-weight: 600;
        }

        .footer {
            width: 100%;
            margin: auto;
            display: flex;
            justify-content: center;
            flex-direction: column;
            font-size: 16px;
            color: white;
            line-height: 1.2;
            text-align: center;
        }

        .footer p{
            margin: auto;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
    </style>

    <body>
        <div id="card" class="main">
            <div class="header">
                <p class="username">${user.username}</p>
                <img src="${user.avatar}">
            </div>
            <div class="footer">
                <p>Razón: ${reason}</p>
                <p>Fecha: ${date}</p>
            </div>
        </div>
    </body>

    </html>
`
}
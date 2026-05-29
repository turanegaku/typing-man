import type { FC } from 'hono/jsx';

type LayoutProps = {
  title: string;
  scripts?: any;
};

export const Layout: FC<LayoutProps & { children?: any }> = ({
  title,
  scripts,
  children,
}) => {
  return (
    <html>
      <head>
        <title>{title}</title>
        <link rel="stylesheet" href="/stylesheets/style.css" />
      </head>
      <body>
        <header>
          <h1>
            <a href="/">{title}</a>
          </h1>
          <nav id="user-nav" />
        </header>

        <div class="container">
          {children}
        </div>

        <script type="text/javascript" src="/static/js/jquery.min.js" />
        <script type="text/javascript" src="/static/js/jquery.easing.min.js" />
        <script type="text/javascript" src="/static/js/jquery.cookie.js" />
        <script type="text/javascript" src="/static/js/moment.min.js" />
        {scripts}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var s=JSON.parse(localStorage.getItem('typing-man:sessions')||'[]');if(s.length&&s[0].name){var n=s[0].name,el=document.getElementById('user-nav');if(el)el.innerHTML='<a href="/user/'+encodeURIComponent(n)+'">&#128100; '+n.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</a>';}}catch(e){}})()`}} />
      </body>
    </html>
  );
};

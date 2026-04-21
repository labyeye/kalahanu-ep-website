const fs = require('fs');
const content = fs.readFileSync('channel-partners.html', 'utf8');




















let newContent = content;


newContent = newContent.replace(/<\/div>\s*<span class="usp-ribbon">/g, '</div>\n            <div class="brand-content">\n              <span class="usp-ribbon">');


newContent = newContent.replace(/<\/a>\s*<\/div>\s*<!-- ───/g, '</a>\n            </div>\n          </div>\n          <!-- ───');


newContent = newContent.replace(/<\/a>\s*<\/div>\s*<\/div>\s*<!-- \/\.brands-grid/g, '</a>\n            </div>\n          </div>\n        </div>\n        <!-- /.brands-grid');

fs.writeFileSync('channel-partners.html', newContent);
console.log('Formatted channel-partners.html');

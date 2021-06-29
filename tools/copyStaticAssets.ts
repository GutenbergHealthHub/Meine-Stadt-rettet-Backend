import * as shell from 'shelljs';

shell.cp('-R', 'src/app/public/', 'dist/app/public/');
shell.cp('-R', 'src/environments/', 'dist/environments/');
shell.cp('-R', 'src/app/certificates/', 'dist/app/certificates/');
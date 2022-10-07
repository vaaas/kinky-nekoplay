/** determine a file's extension */
function extension(x) {
   return x.slice(x.lastIndexOf('.'))
}

const MIMES = {
   '.xhtml': 'application/xhtml+xml',
   '.js': 'text/javascript',
   '.css': 'text/css'
}

/** determine a file's mime type */
export default function determine_mime_type(x) {
   return MIMES[extension(x)] || 'application/octet-stream'
}

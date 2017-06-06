import React from 'react';
import ReactDOM from 'react-dom';
import Editable from './components/editable';

ReactDOM.render(
  <Editable />,
  document.getElementById('editor')
);

//Load foundation after rendering everything, so that it can hook shit like reveals up after all the static and dynamic dom is fully ready
$(document).foundation();

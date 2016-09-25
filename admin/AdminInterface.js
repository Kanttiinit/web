import React from 'react';
import http from 'axios';
import Table from './Table';
import moment from 'moment';
import Ace from 'react-ace';
import _ from 'lodash';

import 'brace/mode/json';
import 'brace/theme/github';

export default class AdminInterface extends React.Component {
   constructor() {
      super();
      this.state = {};
   }
   getBasePath() {
      return 'https://kitchen.kanttiinit.fi/admin/' + this.props.model.name.toLowerCase();
   }
   save() {
      const item = JSON.parse(this.state.editorContent);

      let promise;
      if (this.state.mode === 'editing')
         promise = http.put(this.getBasePath() + '/' + item.id, item);
      else
         promise = http.post(this.getBasePath(), item);

      promise.then(r => {
         this.setState({mode: undefined});
      }).then(() => {
        this.props.onUpdate();
        alert('Item saved!')
      });
   }
   openEditor(item, editing) {
      this.setState({
         editorContent: JSON.stringify(item, null, '  '),
         mode: editing ? 'editing' : 'creating'
      });
   }
   delete(item) {
      if (confirm('Are you sure?')) {
         http.delete(this.getBasePath() + '/' + item.id)
         .then(response => {
           this.props.onUpdate();
           alert('Item deleted!');
         });
      }
   }
   renderItem(item) {
      return (
         <tr key={item.id}>
            {this.props.model.tableFields.map(({key}) =>
            <td key={key}>{_.get(item, key)}</td>
            )}
            <td>
               &nbsp;<button onClick={this.openEditor.bind(this, item, true)} className="btn btn-xs btn-warning">Edit</button>&nbsp;
               <button onClick={this.delete.bind(this, item)} className="btn btn-xs btn-danger">Delete</button>
            </td>
         </tr>
      );
   }
   render() {
      const {model, items} = this.props;
      const {mode, editorContent} = this.state;

      if (!items) {
         return <p>Loading...</p>;
      }

      return (
         <div>
            {!mode &&
            <button className="btn btn-primary" style={{margin: '1em 0'}} onClick={() => this.openEditor(model.defaultFields)}>Create</button>
            }
            {mode &&
            <div className="panel panel-primary" style={{margin: '1em 0'}}>
               <div className="panel-heading">{mode === 'editing' ? 'Editing' : 'Creating'}</div>
               <div className="panel-body">
                  <Ace
                     width='100%'
                     height='400px'
                     onChange={editorContent => this.setState({editorContent})}
                     value={editorContent}
                     theme="github"
                     mode="json" />
                  <div style={{marginTop: '1em'}}>
                     <button onClick={this.save.bind(this)} className="btn btn-primary">{mode === 'editing' ? 'Update' : 'Create'}</button>&nbsp;
                     <button onClick={() => this.setState({mode: undefined})} className="btn btn-warning">Cancel</button>
                  </div>
               </div>
            </div>
            }
            <Table
               sortBy="name"
               headers={model.tableFields}
               renderItem={this.renderItem.bind(this)}
               data={items} />
         </div>
      );
   }
}

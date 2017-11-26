import React from 'react';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';
import TranslateIcon from 'material-ui-icons/Translate';
import ListIcon from 'material-ui-icons/List';
import RestoreIcon from 'material-ui-icons/Restore';

export default function TabRoutes(props) {
  return (
    <Paper>
      <Tabs
        value={props.value}
        onChange={(e, value) => props.onChange(value)}
        fullWidth
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab icon={<TranslateIcon />} label="READ" />
        <Tab icon={<ListIcon />} label="EDIT" />
        <Tab icon={<RestoreIcon />} label="REVIEW" />
      </Tabs>
    </Paper>
  );
}

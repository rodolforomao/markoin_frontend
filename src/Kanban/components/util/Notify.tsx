import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

interface Props {
    msg: String;

}
    function BasicNotify(props: Props) {
    const { msg } = props;
    return (
        <div style={{top: '80px', right:'30px', position:'fixed'}}>
            <Stack sx={{ width: '100%' }} spacing={2} >
            <Alert severity="success">{msg}</Alert>
            </Stack>
        </div>
    );
    }

export default BasicNotify
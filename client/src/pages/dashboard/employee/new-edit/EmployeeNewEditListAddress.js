import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Box, Grid, Button, Stack, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useConfirm from '../../../../hooks/useConfirm'
// components
import Iconify from '../../../../components/Iconify';
import Label from '../../../../components/Label';
import EmployeeAddressNewDialog from './EmployeeAddressNewDialog';
import { AddressDefault } from '../../../../constants/enum';

// ----------------------------------------------------------------------

EmployeeNewEditListAddress.propTypes = {
    isEdit: PropTypes.bool,
};

const LabelStyleGray = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    marginBottom: theme.spacing(0.5),
    color: '#595959',
    fontWeight: 'normal',
}));

const LabelStyleHeader = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.black,
    fontSize: 16.5,
}));


const LabelStyleBlack = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    marginBottom: theme.spacing(0.5),
    color: theme.palette.text.black,
}));

const DividerVertical = () => {
    return (
        <small style={{ color: '#A9A9A9' }}>|</small>
    )
};

export default function EmployeeNewEditListAddress({ isEdit, listAddress }) {

    const [addresses, setAddresses] = useState(listAddress);

    const handleUpdateAddresses = (addresses) => {
        setAddresses(addresses);
    }

    useEffect(() => {
        setAddresses(listAddress);
    }, [listAddress])

    const [defaultAddressIndex, setDefaultAddressIndex] = useState('');

    const handleSelectDefault = (index) => {
        setDefaultAddressIndex(index);
    };

    const [open, setOpen] = useState(false);


    return (
        <>
            {isEdit && (
                <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Grid item xs={12} md={8} >
                        <Card sx={{ p: 2, marginTop: 3 }} className='card'>
                            <Stack direction="row" justifyContent="flex-start">
                                <LabelStyleHeader sx={{ ml: 0.8 }}>Địa chỉ nhận hàng</LabelStyleHeader>
                            </Stack>

                            <Stack sx={{ p: 1, mt: 0.5 }}>
                                <Card sx={{ p: 2 }} className='card'>

                                    {addresses?.map((address, index) => {
                                        return (
                                            <Stack sx={{ p: 1, mt: 0.5 }}>
                                                <Card sx={{ p: 2 }} className='card'>

                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <div key={index}>
                                                            <Stack direction="row" spacing={0.7} >
                                                                <LabelStyleBlack>{address?.fullName}</LabelStyleBlack>
                                                                <DividerVertical />
                                                                <LabelStyleGray>{address?.phoneNumber}</LabelStyleGray>
                                                            </Stack>
                                                            <Stack sx={{ mt: 0.5 }}>
                                                                <LabelStyleGray>{address?.address}</LabelStyleGray>
                                                                <LabelStyleGray>{address?.provinceId}, {address?.districtId}, {address?.wardCode}</LabelStyleGray>
                                                            </Stack>
                                                            {address?.isDefault === AddressDefault.IS_DEFAULT &&
                                                                <Label
                                                                    color="error"
                                                                    variant="ghost"
                                                                    sx={{ width: 70 }}
                                                                >
                                                                    Mặc định
                                                                </Label>
                                                            }


                                                        </div>

                                                        <Stack direction="row" spacing={1.5}>
                                                            <Button
                                                                type="submit"
                                                                color="primary"
                                                                variant="outlined"
                                                            >
                                                                Chỉnh sửa
                                                            </Button>
                                                            <Button
                                                                type="submit"
                                                                variant="outlined"
                                                                color={index === defaultAddressIndex ? 'success' : 'error'}
                                                                onClick={() => handleSelectDefault(index)}
                                                            >
                                                                {index === defaultAddressIndex ? 'Địa chỉ mặc định' : 'Đặt làm mặc định'}
                                                            </Button>
                                                        </Stack>

                                                    </Stack>

                                                </Card>
                                            </Stack>
                                        );
                                    })
                                    }

                                </Card>
                            </Stack>

                            <Stack direction="row" justifyContent="center" sx={{ mt: 3, sm: { display: 'none' } }}>

                                <Button
                                    color="primary"
                                    onClick={() => setOpen(true)}
                                    startIcon={<Iconify icon={'eva:plus-fill'} />
                                    }
                                >
                                    Thêm địa chỉ mới
                                </Button>

                                <EmployeeAddressNewDialog open={open} onClose={() => setOpen(false)} isEdit={isEdit} updateAddresses={handleUpdateAddresses} />
                            </Stack>

                        </Card>
                    </Grid>
                </Grid>
            )
            }
        </>
    )

}


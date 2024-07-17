import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import EmployeeNewEditForm from './EmployeeNewEditForm';
import useFetch from '../../../../hooks/useFetch';
import { ADMIN_API } from '../../../../api/apiConfig';

// ----------------------------------------------------------------------

export default function EmployeeNewEdit() {
    const { themeStretch } = useSettings();
    const { pathname } = useLocation();
    const { id } = useParams();
    const isEdit = pathname.includes('edit');
    const { data } = useFetch(ADMIN_API.employee.details(id), { fetch: isEdit })

    return (

        <Page title={`Quản lý nhân viên - ${!isEdit ? 'Tạo nhân viên' : 'Cập nhật nhân viên'}`}>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={!isEdit ? 'Tạo nhân viên' : 'Cập nhật nhân viên'}
                    links={[
                        { name: 'Danh sách nhân viên', href: PATH_DASHBOARD.account.employee.list },
                        { name: !isEdit ? 'Tạo nhân viên' : data?.code },
                    ]}
                />
                <EmployeeNewEditForm isEdit={isEdit} currentEmployee={data} />
            </Container>
        </Page>
    );
}

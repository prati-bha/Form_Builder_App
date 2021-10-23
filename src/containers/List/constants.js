import { Tag } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { GENERIC_MOMENT_DATE_FORMAT, ROUTES } from '../constants';

export const TABLE_COLUMNS = [{
    title: 'Form Name',
    dataIndex: 'formName',
    key: 'formName',
    render: text => <Tag color="geekblue">{text}</Tag>,
},
{
    title: 'Form URL',
    dataIndex: 'uniqueFormSlug',
    key: 'uniqueFormSlug',
    render: text => <Link to={`${ROUTES.MANAGE_FORM}/${text}`}>{text}</Link>,
},
{
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: text => <Tag color="success">{moment(text).format(GENERIC_MOMENT_DATE_FORMAT)}</Tag>
}
]
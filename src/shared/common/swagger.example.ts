import { HttpStatus } from '@nestjs/common';
import { AUTH_CONST } from 'src/auth/auth.constant';

const userData_example = {
  id: '1',
  createAt: '2022-08-04T01:40:58.175Z',
  updateAt: '2022-09-28T00:16:42.000Z',
  phone: '+84xxxxxxxxx',
  phoneVerify: false,
  email: 'example@gmail.com',
  emailVerify: false,
  idCardNumber: 'xxxxxxxxxxxx',
  socialInsuranceCode: 'xxxxxxxxxx',
  address: 'example',
  username: 'example',
  type: 'official',
  firstName: 'example',
  lastName: 'example',
};

export const SWAGGER_EXAMPLE = {
  //TODO: DEFINE SUCCESS EXAMPLE
  LOGIN_SUCCESS: {
    success: true,
    status: HttpStatus.OK,
    data: {
      accessToken: 'accessToken',
      accessToken_ExpireIn: '15m',
      refreshToken: 'refreshToken',
      refreshToken_ExpireIn: '7d',
    },
    message: AUTH_CONST.LOGIN_SUCCESS,
  },
  LOGOUT_SUCCESS: {
    success: true,
    statusCode: 200,
    data: {
      id: '1',
      username: 'example',
    },
    message: 'LogOut successful',
  },
  USER_CREATED: {
    success: true,
    status: HttpStatus.CREATED,
    data: {
      email: 'exemple@gmail.com',
      username: 'example',
      firstName: 'example',
      lastName: 'example',
      roles: [
        {
          id: '2',
          createAt: '2022-08-01T21:00:43.299Z',
          updateAt: '2022-08-01T21:00:43.299Z',
          roleName: 'employee',
        },
      ],
      phone: null,
      idCardNumber: null,
      socialInsuranceCode: null,
      address: null,
      refreshToken: null,
      id: '1',
      createAt: '2022-09-26T19:57:31.697Z',
      updateAt: '2022-09-26T19:57:31.697Z',
      phoneVerify: false,
      emailVerify: false,
      type: 'probationary',
    },
    message: AUTH_CONST.SIGNUP_SUCCESS,
  },
  SENT_CONFIRM_EMAIL: {
    success: true,
    statusCode: 200,
    data: null,
    message: AUTH_CONST.SEND_CONFIRM_EMAIL_SUCCESS,
  },
  CONFIRM_EMAIL_SUCCESS: {
    success: true,
    statusCode: 200,
    data: {
      id: '1',
      username: 'example',
      email: 'example@gmail.com',
      emailVerify: true,
    },
    message: AUTH_CONST.CONFIRM_EMAIL_SUCCESS,
  },
  REFRESH_TOKEN: {
    success: true,
    statusCode: HttpStatus.OK,
    data: {
      accessToken: 'newAccessToken',
      accessToken_ExpireIn: '15m',
    },
    message: 'Refresh token successful',
  },
  SENT_PHONE_VERIFY: {
    success: true,
    statusCode: 200,
    data: {
      toNumber: '+84xxxxxxxxx',
      status: 'pending',
    },
    message: 'Sent verify code successful',
  },
  CONFIRM_PHONE_SUCCESS: {
    success: true,
    statusCode: 200,
    data: {
      id: '1',
      username: 'example',
      phone: '+84xxxxxxxxx',
      phoneVerify: true,
    },
    message: 'Sent verify code successful',
  },
  GETALL_USER_SUCCESS: {
    success: true,
    statusCode: 200,
    data: {
      items: [userData_example, {}, {}],
      meta: {
        totalItems: 9,
        itemCount: 3,
        itemsPerPage: 3,
        totalPages: 3,
        currentPage: 1,
      },
      links: {
        first: '/user?limit=3',
        previous: '',
        next: '/user?page=2&limit=3',
        last: '/user?page=3&limit=3',
      },
    },
    message: 'Successful',
  },
  GET_OWN_PROFILE_SUCCESS: {
    success: true,
    statusCode: 200,
    data: {
      ...userData_example,
      avatar: {
        id: 8,
        url: 'https://nestjs-project01.s3.ap-southeast-1.amazonaws.com/5a20569b-b90c-4c65-84f3-92d070756f2a-293368401_565905371922888_1783164329171045183_n.jpg',
        key: '5a20569b-b90c-4c65-84f3-92d070756f2a-293368401_565905371922888_1783164329171045183_n.jpg',
      },
    },
    message: 'Successful',
  },
  GET_OWN_ROLES_SUCCESS: {
    success: true,
    statusCode: 200,
    data: ['employee', 'manager', 'hr'],
    message: 'Successful',
  },
  GET_OWN_PERMISSIONS_SUCCESS: {
    success: true,
    statusCode: 200,
    data: ['read_profile', 'update_profile', 'submit_form', 'read_form', 'update_form'],
    message: 'Successful',
  },
  GET_USER_UNDER_MANAGEMENT: {
    success: true,
    statusCode: 200,
    data: [
      {
        id: '1',
        email: 'example1@gmail.com',
        username: 'example1',
        name: {
          first: 'Example1',
          last: 'Example1',
        },
      },
      {
        id: '2',
        email: 'example2@gmail.com',
        username: 'example2',
        name: {
          first: 'Example2',
          last: 'Example2',
        },
      },
    ],
    message: 'Successful',
  },
  GET_MANAGER: {
    success: true,
    statusCode: 200,
    data: {
      id: '1',
      email: 'example@gmail.com',
      username: 'example',
      name: {
        first: 'Example',
        last: 'Example',
      },
    },
    message: 'Successful',
  },
  CHANGE_PASSWORD_SUCCESS: {
    success: true,
    statusCode: 200,
    data: null,
    message: 'Successful',
  },
  CHANGE_PHONENUMBER_SUCCESS: {
    success: true,
    statusCode: 200,
    data: userData_example,
    message: 'Successful',
  },
  CHANGE_EMAIL_SUCCESS: {
    success: true,
    statusCode: 200,
    data: userData_example,
    message: 'Successful',
  },
  GET_OWN_FORMS: {
    success: true,
    statusCode: 200,
    data: [
      {
        id: '3',
        createAt: '2022-08-08T02:19:13.481Z',
        updateAt: '2022-08-23T20:19:36.717Z',
        content: '',
        type: 'probationary',
        status: 'new',
        review: null,
        submitDate: null,
        reviewer: {
          username: 'nguyen02',
        },
      },
      {},
      {},
    ],
    message: 'Successful',
  },

  //TODO: DEFINE ERROR EXAMPLE
  BAD_CREDENTIALS_RESPONSE: {
    success: false,
    status: HttpStatus.UNAUTHORIZED,
    message: 'Wrong username or password',
    error: 'Unauthorized',
  },
  CONFLICT_RESPONSE: {
    success: false,
    status: HttpStatus.CONFLICT,
    message: 'Error message',
    error: 'Conflict',
  },
  UNAUTHORIZED_RESPONSE: {
    success: false,
    status: HttpStatus.UNAUTHORIZED,
    message: 'Unauthorized',
  },
  BAD_REQUEST_RESPONSE: {
    success: false,
    status: HttpStatus.BAD_REQUEST,
    message: 'Error message',
    error: 'Bad Request',
  },
};

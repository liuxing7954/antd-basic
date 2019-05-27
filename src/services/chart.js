import request from '@/utils/request';

export function getData(index) {
  return request(`/data${index}.txt`);
}

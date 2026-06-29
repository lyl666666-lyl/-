import request from '../utils/request'
export const authApi = { login:d=>request.post('/api/auth/login',d), register:d=>request.post('/api/auth/register',d) }
export const userApi = { profile:()=>request.get('/api/user/profile'), update:d=>request.put('/api/user/profile',d), password:d=>request.put('/api/user/password',d) }

export const outletApi = {
  list:p=>request.get('/api/outlets',{params:p}),
  detail:id=>request.get('/api/outlets/'+id),
  add:d=>request.post('/api/admin/outlets',d),
  update:(id,d)=>request.put('/api/admin/outlets/'+id,d),
  status:(id,status)=>request.put('/api/admin/outlets/'+id+'/status',null,{params:{status}})
}

export const routeApi = {
  list:p=>request.get('/api/routes',{params:p}),
  add:d=>request.post('/api/admin/routes',d),
  update:(id,d)=>request.put('/api/admin/routes/'+id,d),
  status:(id,status)=>request.put('/api/admin/routes/'+id+'/status',null,{params:{status}})
}

export const orderApi = {
  create:d=>request.post('/api/orders',d),
  my:status=>request.get('/api/orders/my',{params:{status}}),
  cancel:id=>request.put('/api/orders/'+id+'/cancel'),
  track:(orderNo,senderName)=>request.get('/api/orders/track',{params:{orderNo,senderName}})
}

export const specialistOrderApi = {
  list:p=>request.get('/api/specialist/orders',{params:p}),
  collect:(id,outletId)=>request.put('/api/specialist/orders/'+id+'/collect',null,{params:{outletId}}),
  sort:(id,outletId)=>request.put('/api/specialist/orders/'+id+'/sort',null,{params:{outletId}}),
  transit:(id,description,outletId)=>request.put('/api/specialist/orders/'+id+'/transit',null,{params:{description,outletId}}),
  delivery:id=>request.put('/api/specialist/orders/'+id+'/delivery'),
  sign:(id,receiverSignature)=>request.put('/api/specialist/orders/'+id+'/sign',null,{params:{receiverSignature}}),
  abnormal:(id,reason)=>request.put('/api/specialist/orders/'+id+'/abnormal',null,{params:{reason}})
}

export const adminOrderApi = {
  list:p=>request.get('/api/admin/orders',{params:p}),
  stat:p=>request.get('/api/admin/orders/statistics',{params:p}),
  export:p=>request.get('/api/admin/orders/export',{params:p,responseType:'blob'})
}

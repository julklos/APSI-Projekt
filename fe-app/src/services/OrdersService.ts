import Order from '@/models/Order';
import apiClient from '@/api';
import OrderResponse from '@/models/OrderResponse';
import Cookies from 'js-cookie';
import Coordinates from '@/models/Coordinates'
import TaskVolunteer from '@/models/TaskVolunteer'
import Product from '@/models/Product';
import TasksVolunteerResponse from '@/models/TasksVolunteerResponse';

interface APIOrderBody {
    coord_x: Number,
    coord_y: Number,
  }
export default class OrdersService {
    public async addOrder(newOrder: Order): Promise<OrderResponse> {
      try {
        const data: APIOrderBody = {
            coord_x : newOrder.coordinates.x,
            coord_y: newOrder.coordinates.y,
            //description: JSON.stringify({products: newOrder.products, extra: newOrder.extra,payment: newOrder.payment})
        };
        console.log(newOrder.products)
        apiClient.defaults.headers.post["X-CSRFTOKEN"] = Cookies.get("csrftoken");
        const response = await apiClient.post("/orders/", data);
        const id = response.data.id
        newOrder.products.forEach(async product =>{
            const body= {
                countity: product.countity,
                productType: product.productType,
                name: product.name,
                order: id
            }
            await apiClient.post("/orders/productList_"+id,body)
        })
        
        return new OrderResponse(true, response.status, response.statusText);
      } catch (err) {
        const response = err.response;
        if (response)
          return new OrderResponse(false, response.status,response.statusText );
        else return new OrderResponse(false, 408, response.statusText);
      }
    }
    public async getOrders(coordinates: Coordinates, distance: Number): Promise<TasksVolunteerResponse> {
        try {
          const response = await apiClient.get('/orders/orderInRadius_'+coordinates.x+'_'+coordinates.y+'_'+distance);
         
          const data = response.data
          console.log('info',data)
          let tasksArray : Array<TaskVolunteer> = []
          data.forEach((el: { description: string; id: Number; coord_x: Number | undefined; coord_y: Number | undefined; boomer: String; }) => {
            //   const info = JSON.parse(el.description)
            //   console.log(info)
            //   let products : Array<Product> = []
            //   info.products.forEach((prod: { _description: String | undefined; _category: String | undefined; })=>{
            //       products.push(new Product(prod._description, prod._category))
            //   })
              tasksArray.push(new TaskVolunteer(el.id, new Order([],new Coordinates(el.coord_x, el.coord_y),'',''),el.boomer))

          })
          console.log('tasks',tasksArray)
        
          return new TasksVolunteerResponse(true, response.status, tasksArray);
        } catch (err) {
          const response = err.response;
            return new TasksVolunteerResponse(false, response.status, null);
          
        }
      }
}
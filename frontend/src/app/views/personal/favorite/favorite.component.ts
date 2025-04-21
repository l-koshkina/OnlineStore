import {Component, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {CartService} from "../../../shared/services/cart.service";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  products: FavoriteType[] = [];
  cart: CartType | null = null;
  serverStaticPath = environment.serverStaticPath;
  count: number = 1;

  constructor(private favoriteService: FavoriteService,
              private cartService: CartService,) {
  }

  ngOnInit(): void {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }

        this.products = data as FavoriteType[];

        this.cartService.getCart()
          .subscribe((cartData: CartType | DefaultResponseType) => {
            if ((cartData as DefaultResponseType). error !== undefined) {
              throw new Error((cartData as DefaultResponseType).message);
            }

            this.cart = cartData as CartType;

            if (this.cart && this.cart.items.length > 0) {
              this.products = this.products.map(product => {
                product.countInCart = 0;
                if (this.cart) {
                  const productInCart = this.cart.items.find(item => item.product.id === product.id)
                  if (productInCart) {
                    product.countInCart = productInCart.quantity;
                  }
                }

                return product;
              });
            }

            console.log(this.products);

          })
      })
  }

  removeFromFavorites(id: string): void {
      this.favoriteService.removeFavorite(id)
        .subscribe((data: DefaultResponseType) => {
          if (data.error) {
            //...
            throw new Error(data.message);
          }

          this.products = this.products.filter(item => item.id !== id);
        })
  }

  updateCount(id: string, quantity: number) {
    this.cartService.updateCart(id, quantity)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.cart = data as CartType;

        if (this.cart && this.cart.items.length > 0) {
          this.products = this.products.map(product => {
            product.countInCart = 0;
            if (this.cart) {
              const productInCart = this.cart.items.find(item => item.product.id === product.id)
              if (productInCart) {
                product.countInCart = productInCart.quantity;
              }
            }

            return product;
          });
        }
      })
  }

}

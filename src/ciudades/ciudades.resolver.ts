import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CiudadesService } from './ciudades.service';
import { Ciudad } from './entities/ciudad.entity';


@Resolver()
export class CiudadesResolver {

    constructor( private ciudadesService: CiudadesService){}


//-----------------------------Recetas de una cultura---------------------------------------------------//
    @Mutation(() => Ciudad)
    agregarRestauranteACiudad(@Args('id')  id: string, @Args('restauranteId') restauranteId: string): Promise<Ciudad> {
       return this.ciudadesService.asociarRestauranteACiudad(id, restauranteId);
    }

    @Mutation(() => Ciudad)
    async removeRestauranteDeCiudad(
        @Args('id') id: string,
        @Args('restauranteId') restauranteId: string
    ) {
        return this.ciudadesService.eliminarRestauranteDeCiudad(id, restauranteId);
    }

    @Query(() => [Ciudad], { name: 'getRestaurantesByCiudad' })
    async restaurantesDeCiudad(
        @Args('id') id: string
    ) {
        const ciudad = await this.ciudadesService.findOne(id);
        return ciudad.restaurantes;
    }

}

import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CulturasService } from './culturas.service';
import { Cultura } from './entities/cultura.entity';
import { Receta } from '../recetas/entities/receta.entity';


@Resolver()
export class CulturasResolver {
    constructor(private culturasService: CulturasService){}


//-----------------------------Recetas de una cultura---------------------------------------------------//
    @Mutation(() => Cultura)
    agregarRecetasACultura(@Args('id')  id: string, @Args('recetasId', { type: () => [String] }) recetasId: string[]): Promise<Cultura> {
       return this.culturasService.agregarRecetaACultura(id, recetasId);
    }

    @Mutation(() => Cultura)
    async updateRecetaEnCulturas(
        @Args('id') id: string,
        @Args('recetasId', { type: () => [String] }) recetasId: string[]
    ): Promise<Cultura> {
        return this.culturasService.actualizarRecetasEnCultura(id, recetasId);
    }

    @Mutation(() => Cultura)
    async removeRecetaFromCultura(
        @Args('culturaId') culturaId: string,
        @Args('recetaId') recetaId: string
    ) {
        return this.culturasService.eliminarRecetaDeCultura(culturaId, recetaId);
    }

    @Query(() => [Receta], { name: 'getRecetasByCultura' })
    async recetasDeCultura(
        @Args('culturaId') culturaId: string
    ): Promise<Receta[]> {
        const cultura = await this.culturasService.findOne(culturaId);
        return cultura.recetas;
    }

    @Query(() => Receta, { name: 'getRecetaByCultura' })
    async productoDeReceta(
        @Args('culturaId') culturaId: string,
        @Args('recetaId') recetaId: string
    ): Promise<Receta> {
        const cultura = await this.culturasService.findOne(culturaId);
        return cultura.recetas.find(p => p.id === recetaId);
    }
}

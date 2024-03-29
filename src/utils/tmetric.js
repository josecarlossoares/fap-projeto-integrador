//Importando modulos
const Projeto = require('../models/Projeto')

module.exports = {
    //Consumindo api do t metric
    projetosImport: async function (){
        const token = '5BBDE31796FFA303B07CBDB852360E82A4AB0FC2FB0D8C0BF71F6A87401329C1';
        const url = 'https://app.tmetric.com/api/accounts/226920/projects';

        try{

            const fetch = await import('node-fetch');
            const res = await fetch.default(url, {
                method: 'GET',
                headers: {Authorization: 'Bearer ' + token}
            })

            let data = await res.json()

            data.forEach((element) => {
                const project = new Projeto(element);
                const projectId = project.projectId
                project._id = projectId
                project.budgetAppliedDate = new Date('2024-01-08T13:35:39.239Z');

                //validando a existencia de um projeto e atualizando o mesmo
                Projeto.findOne({ projectId }).then((projeto) =>  {
                    if(projeto){
                        Projeto.findByIdAndUpdate(projectId, project, { new: true }).then((p) => {
                            if(p){
                                console.log('registro atualizado');                                
                            }
                        })
                        
                    }else{
                        //Salvando no banco de dados
                        const novoProjeto = new Projeto(project)
                        novoProjeto.save().then(() => {
                        console.log('Projeto Salvo');
                        
                        }).catch((err) => {
                            console.log(err);                      
                        })
                    }
                })

            });
            
        }catch(err){
            console.log(err);
            
        }
    }

}
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    function index(){

        $response = Invoice::join('menu', 'invoice.idmenu', '=', 'menu.id')
            ->select('invoice.idmenu', 'menu.namamenu', 'menu.harga', 'invoice.qty')
            ->get();

        return response()->json($response);
    }

    function Store(Request $request){
        $invoicesData = $request->input('invoicesData');

        try{
            foreach($invoicesData as $invoiceData){
                $idmenu = $invoiceData['idmenu'];

                $existData = Invoice::where('idmenu', $idmenu)->first();

                    if($existData){
                        $existData->update($invoiceData);
                    }else{
                        Invoice::create($invoiceData);
                    }
                }
                return response()->json(200);
            }
        catch (\Exception $e){
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    function Charge(Request $request){
        $receiptData = $request->input('receiptData');
        $subtotal = $request->input('subtotal');
        $pajak = $request->input('pajak');
        $total = $request->input('total');
        $uang = $request->input('uang');
        $kembalian = $uang - $total;
        
        try{
            $idreceipt = '#' . Str::random(5);
            foreach($receiptData as $receipt){
                
                $result = DB::table('receipt')->insert([
                    'idreceipt' => $idreceipt,
                    'idmenu' => $receipt['idmenu'],
                    'qty' => $receipt['qty']
                ]);
            }
            if($result){
                DB::table('transaksi')->insert([
                    'idreceipt' => $idreceipt,
                    'uang' => $uang,
                    'subtotal' => $subtotal,
                    'pajak' => $pajak,
                    'total' => $total,
                    'kembalian' => $kembalian
                ]);
                Invoice::truncate();
                DB::commit();
                return response()->json([
                    'message' => 'Transaksi Berhasil.',
                200]);
            }else{
                DB::rollBack();
                return response()->json([
                    'message' => 'Transaksi Gagal.',
                500]);
            }
        }catch (\Exception $e){
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }

    }
}
